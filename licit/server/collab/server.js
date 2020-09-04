// @flow

import { Step } from "prosemirror-transform"
import { Schema } from 'prosemirror-model'

import Router from "./route"
import EditorSchema from "../../../src/EditorSchema"
import { getInstance, instanceInfo, setEditorSchema, initEditorSchema } from "./instance"
// [FS] IRAD-899 2020-03-13
// This is for Capcomode document attribute. Shared Step, so that capcomode can be dealt collaboratively.
import SetDocAttrStep from "../../../src/SetDocAttrStep";
// [FS] IRAD-1040 2020-09-02
import * as Flatted from 'flatted';

const router = new Router();

// [FS] IRAD-1040 2020-09-02
let effectiveSchema = EditorSchema;
let lastUpdatedSchema = null;

function handleCollabRequest(req: any, resp: any) {
  // [FS] IRAD-1040 2020-09-02
  initEditorSchema(effectiveSchema);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credential': false,
    'Access-Control-Max-Age': 86400, // 24hrs
    'Access-Control-Allow-Headers':
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  };
  if (!router.resolve(req, resp)) {
    const method = req.method.toUpperCase();
    if (method === 'OPTIONS') {

      resp.writeHead(200, headers);
      resp.end();
    } else {
      resp.writeHead(404, { 'Content-Type': 'text/plain' });
      resp.end('Not found');
    }
  }
}

export default handleCollabRequest

// Object that represents an HTTP response.
class Output {
  // fix_flow_errors:  declarion to  avoid flow errors
  code = null;
  body = null;
  type = "text/plain";
  //end
  constructor(code, body, type) {
    this.code = code
    this.body = body
    this.type = type || "text/plain"
  }

  static json(data) {
    return new Output(200, JSON.stringify(data), "application/json")
  }

  // Write the response.
  resp(resp: any) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': this.type
    };
    resp.writeHead(this.code, headers)
    resp.end(this.body)

  }
}

class CustomError extends Error {
  status: number
  constructor(message: string) {
    super(message);
  }
}

// : (stream.Readable, Function)
// Invoke a callback with a stream's data.
function readStreamAsJSON(stream, callback) {
  let data = ""
  stream.on("data", chunk => data += chunk)
  stream.on("end", () => {
    let result, error
    try { result = JSON.parse(data) }
    catch (e) { error = e }
    callback(error, result)
  })
  stream.on("error", e => callback(e))
}

// : (stream.Readable, Function)
// Invoke a callback with a stream's data.
function readStreamAsFlatted(stream, callback) {
  let data = ""
  stream.on("data", chunk => data += chunk)
  stream.on("end", () => {
    let result, error
    try { result = Flatted.parse(data) }
    catch (e) { error = e }
    callback(error, result)
  })
  stream.on("error", e => callback(e))
}

// : (string, Array, Function)
// Register a server route.
function handle(method, url, f, readFlatted = false) {
  router.add(method, url, (req, resp, ...args) => {
    function finish() {
      let output
      try {
        output = f(...args, req, resp)
      } catch (err) {
        console.log(err.stack)
        output = new Output(err.status || 500, err.toString())
      }
      if (output) output.resp(resp)
    }

    if (method == "PUT" || method == "POST") {
      const readMethod = readFlatted ? readStreamAsFlatted : readStreamAsJSON;
      readMethod(req, (err, val) => {
        if (err) new Output(500, err.toString()).resp(resp)
        else { args.unshift(val); finish() }
      })
    }
    else
      finish()
  })
}

// The root endpoint outputs a list of the collaborative
// editing document instances.
handle("GET", ["docs"], () => {
  return Output.json(instanceInfo())
})

// Output the current state of a document instance.
handle("GET", ["docs", null], (id, req) => {
  let inst = getInstance(id, reqIP(req))
  return Output.json({
    doc_json: inst.doc.toJSON(),
    users: inst.userCount,
    version: inst.version
  })
})

function nonNegInteger(str) {
  let num = Number(str)
  if (!isNaN(num) && Math.floor(num) == num && num >= 0) return num
  let err = new CustomError("Not a non-negative integer: " + str)
  err.status = 400
  throw err
}

// An object to assist in waiting for a collaborative editing
// instance to publish a new version before sending the version
// event data to the client.
class Waiting {
  // fix_flow_errors:  declarion to  avoid flow errors
  resp = null
  inst: any = null
  ip = ''
  finish = null
  done = false
  //end
  constructor(resp, inst, ip, finish) {
    this.resp = resp
    this.inst = inst
    this.ip = ip
    this.finish = finish
    this.done = false
    resp.setTimeout(1000 * 60 * 5, () => {
      this.abort()
      this.send(Output.json({}))
    })
  }

  abort() {
    if (this.inst.waiting) {
      let found = this.inst.waiting.indexOf(this)
      if (found > -1) this.inst.waiting.splice(found, 1)
    }
  }

  send(output) {
    if (this.done) return
    output.resp(this.resp)
    this.done = true
  }
}

function outputEvents(inst, data) {
  return Output.json({
    version: inst.version,
    steps: data.steps.map(s => s.toJSON()),
    clientIDs: data.steps.map(step => step.clientID),
    users: data.users
  })
}

// An endpoint for a collaborative document instance which
// returns all events between a given version and the server's
// current version of the document.
handle("GET", ["docs", null, "events"], (id, req, resp) => {
  let version = nonNegInteger(req.query.version)

  let inst = getInstance(id, reqIP(req))
  let data = inst.getEvents(version)
  if (data === false)
    return new Output(410, "History no longer available")
  // If the server version is greater than the given version,
  // return the data immediately.
  if (data.steps.length)
    return outputEvents(inst, data)
  // If the server version matches the given version,
  // wait until a new version is published to return the event data.
  let wait = new Waiting(resp, inst, reqIP(req), () => {
    wait.send(outputEvents(inst, inst.getEvents(version)))
  })
  inst.waiting.push(wait)
  resp.on("close", () => wait.abort())
})

function reqIP(request) {
  return request.headers["x-forwarded-for"] || request.socket.remoteAddress
}

// The event submission endpoint, which a client sends an event to.
handle("POST", ["docs", null, "events"], (data, id, req) => {
  let version = nonNegInteger(data.version)
  let steps = data.steps.map(s => Step.fromJSON(effectiveSchema, s))
  let result = getInstance(id, reqIP(req)).addEvents(version, steps, data.clientID)
  if (!result)
    return new Output(409, "Version not current")
  else
    return Output.json(result)
})

// [FS] IRAD-1040 2020-09-02
// set the effective schema from client to work the plugins collaboratively
handle("POST", ["docs", null, "schema"], (data, id, req) => {
  const updatedSchema = Flatted.stringify(data);
  // Do a string comparison to see if they are same or not.
  // if same, don't update
  if(lastUpdatedSchema !== updatedSchema) {
    lastUpdatedSchema = updatedSchema;
	  const spec = data['spec'];  
	  updateSpec(spec, 'nodes');
	  updateSpec(spec, 'marks');
	  effectiveSchema = new Schema({ nodes: effectiveSchema.spec.nodes, marks: effectiveSchema.spec.marks });
	  setEditorSchema(effectiveSchema);
  }
  return Output.json({ result: 'success' });
}, true)

function updateSpec(spec, attrName) {
  // clear current array
  effectiveSchema.spec[attrName].content.splice(0, effectiveSchema.spec[attrName].content.length);
  const collection = spec[attrName]['content'];
  // update current array with the latest info
  for (var i = 0; i < collection.length; i += 2) {
    effectiveSchema.spec[attrName] = effectiveSchema.spec[attrName].update(collection[i], collection[i+1]);
  }
}