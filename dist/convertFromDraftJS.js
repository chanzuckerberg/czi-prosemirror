'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFromDraftJS;

var _prosemirrorState = require('prosemirror-state');

var _convertFromHTML = require('./convertFromHTML');

var _convertFromHTML2 = _interopRequireDefault(_convertFromHTML);

var _convertDraftJSToHTML = require('./convertDraftJSToHTML');

var _convertDraftJSToHTML2 = _interopRequireDefault(_convertDraftJSToHTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromDraftJS(content) {
  var html = (0, _convertDraftJSToHTML2.default)(content);
  return (0, _convertFromHTML2.default)(html);
}