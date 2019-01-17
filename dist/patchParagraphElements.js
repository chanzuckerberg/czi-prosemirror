'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchParagraphElements;

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patchParagraphElements(doc) {
  (0, _from2.default)(doc.querySelectorAll('p')).forEach(patchParagraphElement);
}

function patchParagraphElement(pElement) {
  var marginLeft = pElement.style.marginLeft;

  if (marginLeft) {
    var indent = (0, _ParagraphNodeSpec.convertMarginLeftToIndentValue)(marginLeft);
    if (indent) {
      pElement.setAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT, String(indent));
    }
  }
}