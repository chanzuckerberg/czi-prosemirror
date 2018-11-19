// @flow

import applyInlineStyleSheetStyles from './applyInlineStyleSheetStyles';

export default function normalizeHTML(html: string): string {
  let body: ?HTMLElement = null;

  if (/<body[\s>]/i.test(html) === false) {
    html = `<!doctype><html><body>${html}</body></html>`;
  }

  // Provides a dom node that will not execute scripts
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
  // https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
  if (
    typeof document !== 'undefined' &&
    document.implementation &&
    document.implementation.createHTMLDocument
  ) {
    const doc = document.implementation.createHTMLDocument('');
    doc.open();
    doc.write(html);
    doc.close();
    applyInlineStyleSheetStyles(doc);
    body = doc.getElementsByTagName('body')[0];
  }

  if (!body) {
    return 'Unsupported HTML content';
  }

  html = body.innerHTML;
  return html;
}
