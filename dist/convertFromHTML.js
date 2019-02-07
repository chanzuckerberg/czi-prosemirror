'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFromHTML;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _convertFromDOMElement = require('./convertFromDOMElement');

var _convertFromDOMElement2 = _interopRequireDefault(_convertFromDOMElement);

var _normalizeHTML = require('./normalizeHTML');

var _normalizeHTML2 = _interopRequireDefault(_normalizeHTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromHTML(html, schema, plugins) {
  var root = document.createElement('html');
  var newHTML = (0, _normalizeHTML2.default)(html);
  root.innerHTML = newHTML;
  return (0, _convertFromDOMElement2.default)(root, schema, plugins);
}