'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toSafeHTMLDocument;


// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
function toSafeHTMLDocument(html) {

  if (typeof document !== 'undefined' && document.implementation && document.implementation.createHTMLDocument) {
    var doc = document.implementation.createHTMLDocument('');
    doc.open();
    doc.write(html);
    doc.close();
    return doc;
  }
  return null;
}