'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toSafeHTMLDocument;


// Parses HTML in a detached document to help with avoiding XSS
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
// https://github.com/ProseMirror/prosemirror/issues/473#issuecomment-255727531
function toSafeHTMLDocument(html) {
  var parser = new window.DOMParser();
  return parser.parseFromString(html, 'text/html');
}