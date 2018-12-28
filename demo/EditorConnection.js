/* eslint-disable */

import {collab, getVersion, receiveTransaction, sendableSteps} from "prosemirror-collab"
import {EditorState} from 'prosemirror-state';
import {Step} from 'prosemirror-transform';

import EditorPlugins from '../src/EditorPlugins';
import EditorSchema from '../src/EditorSchema';
import uuid from '../src/ui/uuid';
import {GET, POST} from "./http"
import throttle from './throttle';

function badVersion(err) {
  return err.status == 400 && /invalid version/i.test(err)
}

class State {
  constructor(edit, comm) {
    this.edit = edit
    this.comm = comm
  }
}
class EditorConnection {
  constructor(onReady, report, url) {
    this.report = report
    this.url = url
    this.state = new State(null, "start")
    this.request = null
    this.backOff = 0
    this.view = null
    this.dispatch = this.dispatch.bind(this)
    this.poll = throttle(this.poll, 1000, this);
    // this.poll = this.poll.bind(this);
    this.ready = false;
    this.onReady = onReady;

    this.start();
  }

  // All state changes go through this
  dispatch(action) {
    let newEditState = null
    if (action.type == "loaded") {
      let editState = EditorState.create({
        doc: action.doc,
        plugins: EditorPlugins.concat([
          collab({
            clientID: uuid(),
            version: action.version,
          }),
        ])
      })
      this.state = new State(editState, "poll")
      this.ready = true;
      this.onReady(editState);
      this.poll()
    } else if (action.type == "restart") {
      this.state = new State(null, "start")
      this.start()
    } else if (action.type == "poll") {
      this.state = new State(this.state.edit, "poll")
      this.poll()
    } else if (action.type == "recover") {
      if (action.error.status && action.error.status < 500) {
        this.report.failure(action.error)
        this.state = new State(null, null)
      } else {
        this.state = new State(this.state.edit, "recover")
        this.recover(action.error)
      }
    } else if (action.type == "transaction") {
      newEditState = this.state.edit.apply(action.transaction)
    }

    if (newEditState) {
      let sendable
      if (newEditState.doc.content.size > 40000) {
        if (this.state.comm != "detached") this.report.failure("Document too big. Detached.")
        this.state = new State(newEditState, "detached")
      } else if ((this.state.comm == "poll" || action.requestDone) && (sendable = this.sendable(newEditState))) {
        this.closeRequest()
        this.state = new State(newEditState, "send")
        this.send(newEditState, sendable)
      } else if (action.requestDone) {
        this.state = new State(newEditState, "poll")
        this.poll()
      } else {
        this.state = new State(newEditState, this.state.comm)
      }
    }

    // Sync the editor with this.state.edit
    if (this.state.edit && this.view) {
      this.view.updateState(this.state.edit);
    }
  }

  // Load the document from the server and start up
  start() {
    this.run(GET(this.url)).then(data => {
      data = JSON.parse(data)
      this.report.success()
      this.backOff = 0
      this.dispatch({type: "loaded",
                     doc: EditorSchema.nodeFromJSON(data.doc),
                     version: data.version,
                     users: data.users,
                     })
    }, err => {
      this.report.failure(err)
    })
  }

  // Send a request for events that have happened since the version
  // of the document that the client knows about. This request waits
  // for a new version of the document to be created if the client
  // is already up-to-date.
  poll() {
    let query = "version=" + getVersion(this.state.edit);
    console.log('poll', query);
    this.run(GET(this.url + "/events?" + query)).then(data => {
      console.log('poll:success', data);
      this.report.success()
      data = JSON.parse(data)
      if (data.confirmed === false) {
        this.poll();
        return;
      }
      this.backOff = 0
      if (data.steps && (data.steps.length)) {
        let tr = receiveTransaction(this.state.edit, data.steps.map(j => Step.fromJSON(EditorSchema, j)), data.clientIDs)
        this.dispatch({type: "transaction", transaction: tr, requestDone: true})
      } else {
        this.poll()
      }
    }, err => {
      if (err.status == 410 || badVersion(err)) {
        // Too far behind. Revert to server state
        this.report.failure(err)
        this.dispatch({type: "restart"})
      } else if (err) {
        this.dispatch({type: "recover", error: err})
      }
    })
  }

  sendable(editState) {
    let steps = sendableSteps(editState)
    if (steps) {
      return {steps}
    }
  }

  // Send the given steps to the server
  send(editState, {steps}) {
    let json = JSON.stringify({version: getVersion(editState),
                               steps: steps ? steps.steps.map(s => s.toJSON()) : [],
                               clientID: steps ? steps.clientID : 0,
                               })
    this.run(POST(this.url + "/events", json, "application/json")).then(data => {
      this.report.success()
      this.backOff = 0
      let tr = steps
          ? receiveTransaction(this.state.edit, steps.steps, repeat(steps.clientID, steps.steps.length))
          : this.state.edit.tr
      this.dispatch({type: "transaction", transaction: tr, requestDone: true})
    }, err => {
      if (err.status == 409) {
        // The client's document conflicts with the server's version.
        // Poll for changes and then try again.
        this.backOff = 0
        this.dispatch({type: "poll"})
      } else if (badVersion(err)) {
        this.report.failure(err)
        this.dispatch({type: "restart"})
      } else {
        this.dispatch({type: "recover", error: err})
      }
    })
  }

  // Try to recover from an error
  recover(err) {
    let newBackOff = this.backOff ? Math.min(this.backOff * 2, 6e4) : 200
    if (newBackOff > 1000 && this.backOff < 1000) this.report.delay(err)
    this.backOff = newBackOff
    setTimeout(() => {
      if (this.state.comm == "recover") this.dispatch({type: "poll"})
    }, this.backOff)
  }

  closeRequest() {
    if (this.request) {
      this.request.abort()
      this.request = null
    }
  }

  run(request) {
    return this.request = request
  }

  close() {
    this.closeRequest()
    this.setView(null)
  }

  setView(view) {
    if (this.view) this.view.destroy()
    this.view = window.view = view
  }
}

function repeat(val, n) {
  let result = []
  for (let i = 0; i < n; i++) result.push(val)
  return result
}

export default EditorConnection;