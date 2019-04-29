'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.registeryKeys = registeryKeys;
exports.exportJSON = exportJSON;
exports.registerEditorView = registerEditorView;
exports.releaseEditorView = releaseEditorView;
exports.findEditorView = findEditorView;
exports.executeCommand = executeCommand;
exports.registerCommand = registerCommand;

var _prosemirrorView = require('prosemirror-view');

var _convertToJSON = require('./convertToJSON');

var _convertToJSON2 = _interopRequireDefault(_convertToJSON);

var _CustomEditorView = require('./ui/CustomEditorView');

var _CustomEditorView2 = _interopRequireDefault(_CustomEditorView);

var _UICommand = require('./ui/UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandsRegistery = new _map2.default();
var viewsRegistery = new _map2.default();

// This file exports methods to help developer to debug editor from web
// inspector. To use this, add the following lines to export the utility.
//
//   import * as CZIProseMirror from 'czi-prosemirror/dist/CZIProseMirror';
//   window.CZIProseMirror = CZIProseMirror;

function registeryKeys() {
  return (0, _from2.default)(viewsRegistery.keys());
}

function exportJSON(id) {
  if (!id && viewsRegistery.size) {
    id = registeryKeys()[0];
    console.log('use default editor id "' + id + '"');
  }
  var view = viewsRegistery.get(String(id));
  if (!view) {
    throw new Error('view ${id} does not exist');
  }
  return (0, _convertToJSON2.default)(view.state);
}

function registerEditorView(id, view) {
  if (viewsRegistery.has(id)) {
    throw new Error('view ${id} already registered');
  }
  if (!(view instanceof _CustomEditorView2.default)) {
    throw new Error('invalid view ' + id);
  }
  if (!id) {
    throw new Error('id is required');
  }
  viewsRegistery.set(id, view);
}

function releaseEditorView(id) {
  if (!viewsRegistery.has(id)) {
    throw new Error('view ${id} was released');
  }
  viewsRegistery.delete(id);
}

function findEditorView(id) {
  return viewsRegistery.get(id) || null;
}

function executeCommand(name, viewID) {
  var command = commandsRegistery.get(name);
  if (command) {
    var view = viewID ? viewsRegistery.get(viewID) : (0, _from2.default)(viewsRegistery.values())[0];
    if (view) {
      try {
        return command.execute(view.state, view.dispatch, view, null);
      } catch (ex) {
        console.warn(ex);
        return false;
      }
    }
  }
  return false;
}

function registerCommand(name, command) {
  if (!(command instanceof _UICommand2.default)) {
    throw new Error('invalid command ' + name);
  }
  if (!name) {
    throw new Error('invalid command name');
  }
  if (commandsRegistery.has(name)) {
    throw new Error('command ${name} already registered');
  }
  commandsRegistery.set(name, command);
}