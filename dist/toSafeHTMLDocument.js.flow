// @flow


// Parses HTML in a detached document to help with avoiding XSS
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
// https://github.com/ProseMirror/prosemirror/issues/473#issuecomment-255727531
export default function toSafeHTMLDocument(html: string): ?Document {
  const parser = new window.DOMParser();
  return parser.parseFromString(html, 'text/html');
}
