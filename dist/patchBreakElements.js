'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchBreakElements;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patchBreakElements(doc) {
  // This is a workaround to handle HTML converted from DraftJS that
  // `<div><span><br /></span><div>` becomes `<p><br /><br /></p>`.
  // Block with single `<br />` inside should be collapsed into `<p />`.
  var selector = 'div > span:only-child > br:only-child';
  (0, _from2.default)(doc.querySelectorAll(selector)).forEach(patchBreakElement);
}

function patchBreakElement(brElement) {
  var ownerDocument = brElement.ownerDocument,
      parentElement = brElement.parentElement;

  if (!ownerDocument || !parentElement) {
    return;
  }
  var div = brElement.parentElement && brElement.parentElement.parentElement;
  if (!div) {
    return;
  }
  var pp = ownerDocument.createElement('p');
  div.parentElement && div.parentElement.replaceChild(pp, div);
}