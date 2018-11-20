// @flow

import hyphenize from './hyphenize';

// Ensure that inline-styles can be correctly translated as inline marks.
export default function patchInlineStyles(doc: Document): void {
  // Workaround to patch inline styles added to <p /> by google doc.
  const pEls = Array.from(doc.querySelectorAll('p[style]'));
  pEls.forEach(patchElement);
}

const NODE_TYPE_TEXT = 3;
const NODE_TYPE_ELEMENT = 1;
const INLINE_STYLE_NAMES = [
  'backgroundColor',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'textDecoration',
];

const INLINE_ELEMENT_NODE_NAMES = new Set([
  'B',
  'EM',
  'I',
  'SPAN',
  'STRONG',
  'U',
]);

function patchElement(el: HTMLElement): void {
  INLINE_STYLE_NAMES.forEach((name) => patchElementStyle(el, name));
}

// Move the specified inline style of the element to its child nodes. This
// assumes that its child nodes are inline elements.
function patchElementStyle(el: HTMLElement, inlineStyleName: string): void {
  const element: any = el;
  const elementStyle = element.style;
  const value = elementStyle && elementStyle[inlineStyleName];
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
