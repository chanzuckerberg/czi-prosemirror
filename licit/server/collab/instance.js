// @flow

const {readFileSync, writeFile} = require("fs")

import EditorSchema from "../../../src/EditorSchema"

const MAX_STEP_HISTORY = 10000

// A collaborative editing document instance.
export class Instance {
  // fix_flow_errors:  declarion to  avoid flow errors
  id = null;
  doc = null;
  version :any;
  steps = [];
  lastActive = Date.now();
  users = Object.create(null);
  userCount = 0;
  waiting = [];
  collecting = null;
  // end 
  constructor(id:any, doc:any) {
    this.id = id
    this.doc = doc || EditorSchema.node("doc", null, [EditorSchema.node("paragraph", null, [
      EditorSchema.text(" ")
    ])])
    // The version number of the document instance.
    this.version = 0
    this.steps = []
    this.lastActive = Date.now()
    this.users = Object.create(null)
    this.userCount = 0
    this.waiting = []

    this.collecting = null
  }

  stop() {
    if (this.collecting != null) clearInterval(this.collecting)
  }

  addEvents(version:any, steps:any, clientID:any) {
    this.checkVersion(version)
    if (this.version != version) return false
    let doc = this.doc, maps = []
    for (let i = 0; i < steps.length; i++) {
      steps[i].clientID = clientID
      let result = steps[i].apply(doc)
      doc = result.doc
      maps.push(steps[i].getMap())
    }
    this.doc = doc
    this.version += steps.length
    if (this.steps) {
      this.steps = this.steps.concat(steps)
      if (this.steps.length > MAX_STEP_HISTORY)
        this.steps = this.steps.slice(this.steps.length - MAX_STEP_HISTORY)
    }
    this.sendUpdates()
    scheduleSave()
    return {version: this.version}
  }

  sendUpdates() {
    while (this.waiting.length) this.waiting.pop().finish()
  }

  // : (Number)
  // Check if a document version number relates to an existing
  // document version.
  checkVersion(version:any) {
    if (version < 0 || version > this.version) {
      let err ={};
      err.message= "Invalid version " + version;
      err.status = '400';
      throw err
    }
  }

  // : (Number, Number)
  // Get events between a given document version and
  // the current document version.
  getEvents(version:any) {
    this.checkVersion(version)
    let startIndex = this.steps.length - (this.version - version)
    if (startIndex < 0) return false

    return {steps: this.steps.slice(startIndex),
            users: this.userCount}
  }

  collectUsers() {
    const oldUserCount = this.userCount
    this.users = Object.create(null)
    this.userCount = 0
    this.collecting = null
    for (let i = 0; i < this.waiting.length; i++)
      this._registerUser(this.waiting[i].ip)
    if (this.userCount != oldUserCount) this.sendUpdates()
  }

  registerUser(ip:any) {
    if (!(ip in this.users)) {
      this._registerUser(ip)
      this.sendUpdates()
    }
  }

  _registerUser(ip:any) {
    if (!(ip in this.users)) {
      this.users[ip] = true
      this.userCount++
      if (this.collecting == null)
        this.collecting = setTimeout(() => this.collectUsers(), 5000)
    }
  }
}

const instances = Object.create(null)
let instanceCount = 0
let maxCount = 20

let saveFile = __dirname + "/../demo-instances.json", json
if (process.argv.indexOf("--fresh") == -1) {
  try {
    json = JSON.parse(readFileSync(saveFile, "utf8"))
  } catch (e) {}
}

if (json) {
  for (let prop in json)
    newInstance(prop, EditorSchema.nodeFromJSON(json[prop].doc))
}

let saveTimeout = null, saveEvery = 1e4
function scheduleSave() {
  if (saveTimeout != null) return
  saveTimeout = setTimeout(doSave, saveEvery)
}
function doSave() {
  saveTimeout = null
  let out = {}
  for (var prop in instances)
    out[prop] = {doc: instances[prop].doc.toJSON()}
  writeFile(saveFile, JSON.stringify(out), () => null)
}

export function getInstance(id:any, ip:any) {
  let inst = instances[id] || newInstance(id)
  if (ip) inst.registerUser(ip)
  inst.lastActive = Date.now()
  return inst
}

function newInstance(id:any, doc:any) {
  if (++instanceCount > maxCount) {
    let oldest:any = null
    for (let id in instances) {
      let inst = instances[id]
      if (!oldest || inst.lastActive < oldest.lastActive) oldest = inst
    }
    instances[oldest.id].stop()
    delete instances[oldest.id]
    --instanceCount
  }
  return instances[id] = new Instance(id, doc)
}

export function instanceInfo() {
  let found = []
  for (let id in instances)
    found.push({id: id, users: instances[id].userCount})
  return found
}

export default instanceInfo