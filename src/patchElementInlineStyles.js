// @flow

import hyphenize from './hyphenize';
import {DEFAULT_BACKGROUND_COLOR, DEFAULT_TEXT_COLOR} from './patchStyleElements';
import toHexColor from './ui/toHexColor';

export default function patchElementInlineStyles(doc: Document): void {
  // Clean up inline styles added by brower while copying content.
  const iEls = Array.from(doc.querySelectorAll('*[style]'));
  iEls.forEach(clearInlineStyles);

  // Ensure that inline-styles can be correctly translated as inline marks.
  // Workaround to patch inline styles added to <p /> by google doc.
  const bEls = Array.from(doc.querySelectorAll('p[style]'));
  bEls.forEach(patchBlockElement);
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

function clearInlineStyles(el: HTMLElement): void {
  const {style} = el;
  if (!style) {
    return;
  }
  const {color, backgroundColor} = style;
  if (color && toHexColor(color) === DEFAULT_TEXT_COLOR) {
    style.color = '';
  }
  if (
    backgroundColor &&
    toHexColor(backgroundColor) === DEFAULT_BACKGROUND_COLOR
  ) {
    style.backgroundColor = '';
  }
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
    const charactersSize = parseInt(value, 10) / 4;
    if (charactersSize) {
      // Replace text-indent with space characters
      // https://www.fileformat.info/info/unicode/char/25a1/index.htm
      const chars = (new Array(charactersSize).join('\u3000\u200C'));
      const textNode = el.ownerDocument.createTextNode(chars);
      el.insertBefore(textNode, el.firstChild);
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
