// @flow

import patchElementInlineStyles from './patchElementInlineStyles';
import patchListElements from './patchListElements';
import patchStyleElements from './patchStyleElements';
import patchTableElements from './patchTableElements';

const BRAILLE_PATTERN_BLANK = '\u2800'

export default function normalizeHTML(html: string): string {
  let body: ?HTMLElement = null;

  // All space characters will be collapsed. That said, `&nbsp;` should
  // be replace by "\u2800" so we could keep the blank space visible.
  html = html.replace(/(\s*\&nbsp;\s*\&nbsp;\s*)/g, BRAILLE_PATTERN_BLANK);

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
    patchStyleElements(doc);
    patchElementInlineStyles(doc);
    patchListElements(doc);
    patchTableElements(doc);
    body = doc.getElementsByTagName('body')[0];
  }

  if (!body) {
    return 'Unsupported HTML content';
  }

  html = body.innerHTML;
  return html;
}
