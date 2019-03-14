'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = handleEditorPaste;

var _prosemirrorView = require('prosemirror-view');

var _ImageUploadPlaceholderPlugin = require('../ImageUploadPlaceholderPlugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// workaround to support ClipboardEvent as a valid type.
// https://github.com/facebook/flow/issues/1856
function handleEditorPaste(view, event) {
  var clipboardData = event.clipboardData;

  if (!clipboardData) {
    return false;
  }
  var files = clipboardData.files;

  if (!files || !files.length) {
    return false;
  }
  var filesList = (0, _from2.default)(files);

  if ((0, _ImageUploadPlaceholderPlugin.uploadImageFiles)(view, filesList)) {
    event.preventDefault();
    return true;
  }

  return false;
}