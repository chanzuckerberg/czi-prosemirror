'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = handleEditorDrop;

var _prosemirrorView = require('prosemirror-view');

var _ImageUploadPlaceholderPlugin = require('../ImageUploadPlaceholderPlugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://prosemirror.net/examples/upload/
function handleEditorDrop(view, event) {
  var dataTransfer = event.dataTransfer;

  if (!dataTransfer) {
    return false;
  }
  var files = dataTransfer.files;

  if (!files || !files.length) {
    return false;
  }

  var filesList = (0, _from2.default)(files);
  var coords = { x: event.clientX, y: event.clientY };
  if ((0, _ImageUploadPlaceholderPlugin.uploadImageFiles)(view, filesList, coords)) {
    event.preventDefault();
    return true;
  }
  return false;
}