// @flow

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
  const value = elementStyle && elementStyle[inlineStyleName];

  if (inlineStyleName === 'textIndent' && value) {
    // This is the workaround to fix the issue that people with mix both
    // text-indent and margin-left together.
    // For instance, `margin-left: -100px` and `text-indent: 100px` shall
    // offset each other.

    const marginLeft = (elementStyle.marginLeft || '');
    switch (true) {
      case value === ('-' + marginLeft):
      case marginLeft === ('-' + value):
        elementStyle.marginLeft = '';
        elementStyle.textIndent = '';
        break;
    }
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
