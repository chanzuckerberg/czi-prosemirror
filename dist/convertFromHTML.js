'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFromHTML;

var _convertFromDOMElement = require('./convertFromDOMElement');

var _convertFromDOMElement2 = _interopRequireDefault(_convertFromDOMElement);

var _normalizeHTML = require('./normalizeHTML');

var _normalizeHTML2 = _interopRequireDefault(_normalizeHTML);

var _prosemirrorState = require('prosemirror-state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromHTML(html) {
  // TODO: Replace thsi with getSafeDOM.
  var root = document.createElement('czi-prose-mirror-root');
  root.innerHTML = (0, _normalizeHTML2.default)(html);
  return (0, _convertFromDOMElement2.default)(root);
}