// @flow

import {convertMarginLeftToIndentValue} from './ParagraphNodeSpec';
import hyphenize from './hyphenize';

const BLOCK_TAG_SELECTOR =
  ('p,h1,h2,h3,h4,h5,h6,li').replace(/\w+/g, (m) => `${m}[style]`);

export default function patchElementInlineStyles(doc: Document): void {
  // Ensure that inline-styles can be correctly translated as inline marks.
  // Workaround to patch inline styles added to block tags.
  const bEls = Array.from(doc.querySelectorAll(BLOCK_TAG_SELECTOR));
  bEls.forEach(patchBlockElement);
}

const NODE_TYPE_TEXT = 3;
const NODE_TYPE_ELEMENT = 1;
const INLINE_STYLE_NAMES = [
  'backgroundColor',
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'textDecoration',
  'textIndent',
];

const INLINE_ELEMENT_NODE_NAMES = new Set([
  'A',
  'B',
  'EM',
  'I',
  'SPAN',
  'STRONG',
  'U',
]);

function patchBlockElement(el: HTMLElement): void {
  INLINE_STYLE_NAMES.forEach((name) => patchBlockElementStyle(el, name));
}

// Move the specified inline style of the element to its child nodes. This
// assumes that its child nodes are inline elements.
function patchBlockElementStyle(
  el: HTMLElement,
  inlineStyleName: string,
): void {
  const element: any = el;
  const elementStyle = element.style;
  let value = elementStyle && elementStyle[inlineStyleName];

  if (value && inlineStyleName === 'textIndent') {
    const indent = convertMarginLeftToIndentValue(value);
    if (indent) {
      // Replace text-indent with spacer.
      const doc = el.ownerDocument;
      const frag = doc.createDocumentFragment();
      const spacer = doc.createElement('span');
      spacer.innerHTML = '___';
      spacer.style.color = 'transparent';
      for (let ii = 0; ii < indent; ii++) {
        frag.appendChild(spacer.cloneNode(true));
      }
      el.insertBefore(frag, el.firstChild);
    }
    value = '';
  }

  if (!value) {
    return;
  }

  // Remove the style.
  elementStyle[inlineStyleName] = '';

  const childNodes = Array.from(element.childNodes);
  childNodes.forEach((node) => {
    const {
      nodeType,
      style,
      nodeName,
      ownerDocument,
      parentElement,
    } = node;

    if (nodeType === NODE_TYPE_ELEMENT) {
      if (INLINE_ELEMENT_NODE_NAMES.has(nodeName)) {
        const cssText =
           `${hyphenize(inlineStyleName)}: ${value};` + style.cssText;
       style.cssText = cssText;
      }
    } else if (nodeType === NODE_TYPE_TEXT) {
      if (ownerDocument && parentElement) {
        const span: any = ownerDocument.createElement('span');
        span.style[inlineStyleName] = value;
        parentElement.insertBefore(span, node);
        span.appendChild(node);
      }
    }
  });
}
