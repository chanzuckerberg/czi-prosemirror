// @flow

import {ATTRIBUTE_LIST_STYLE_COLOR, ATTRIBUTE_LIST_STYLE_TYPE} from './ListItemNodeSpec';
import {ATTRIBUTE_INDENT, EMPTY_CSS_VALUE, convertMarginLeftToIndentValue} from './ParagraphNodeSpec';
import {ATTRIBUTE_CSS_BEFORE_CONTENT} from './patchStyleElements';
import toHexColor from './ui/toHexColor';

export default function patchListElements(doc: Document): void {
  Array.from(doc.querySelectorAll('ol, ul')).forEach(patchListElementsElement);
}

// This assumes that every 36pt maps to one indent level.
const CHAR_BULLET = '\u25cf';
const CHAR_CIRCLE = '\u25cb';
const CHAR_SQUARE = '\u25a0';
const CHAR_BOX = '\u274f';
const INLINE_NODE_NAME_PATTERN = /^(#text)|(A|SPAN|B|STRONG)$/;

function patchListElementsElement(listElement: HTMLElement): void {
  // If the children of `listElement` all have teh same marginLeft, assume
  // it to be indented.
  let marginLeft = undefined;
  let beforeContent = undefined;
  const {parentElement, children} = listElement;
  if (parentElement && parentElement.nodeName === 'LI') {
    // TODO: Handle this later.
    console.error('nested list is not supported', listElement);
  }
  Array.from(children).forEach(listItemElement => {
    const {style} = listItemElement;
    patchPaddingStyle(listItemElement);

    const bc = listItemElement.getAttribute(ATTRIBUTE_CSS_BEFORE_CONTENT) || '';
    if (beforeContent === undefined) {
      beforeContent = bc;
    }
    if (beforeContent !== bc) {
      beforeContent = null;
    }

    const ml = (style && style.marginLeft) || '';
    if (marginLeft === undefined) {
      marginLeft = ml;
    }

    if (ml !== marginLeft) {
      marginLeft = null;
    }

    const {firstElementChild, lastElementChild} = listItemElement;
    if (firstElementChild && firstElementChild === lastElementChild) {
      // If <li /> has only only one child with the same text color, assume
      // that text color will be used for list style type, too.
      const el: any = firstElementChild;
      const color = el.style ? el.style.color : null;
      color && listItemElement.setAttribute(
        ATTRIBUTE_LIST_STYLE_COLOR,
        toHexColor(color),
      );
    }
  });

  if (marginLeft) {
    const indent = convertMarginLeftToIndentValue(marginLeft);
    if (indent) {
      listElement.setAttribute(ATTRIBUTE_INDENT, String(indent));
    }
  }

  if (beforeContent) {
    beforeContent = String(beforeContent);
    let listStyleType;
    switch (true) {
      case beforeContent.indexOf(CHAR_BULLET) > -1:
        listStyleType = 'disc';
        break;

      case beforeContent.indexOf(CHAR_CIRCLE) > -1:
        listStyleType = 'circle';
        break;

      case beforeContent.indexOf(CHAR_SQUARE) > -1:
        listStyleType = 'square';
        break;

      case beforeContent.indexOf(CHAR_BOX) > -1:
        listStyleType = 'box';
        break;

      case beforeContent.indexOf('lower-latin') > -1:
        listStyleType = 'lower-latin';
        break;

      case beforeContent.indexOf('upper-latin') > -1:
        listStyleType = 'upper-latin';
        break;

      case beforeContent.indexOf('lower-roman') > -1:
        listStyleType = 'lower-roman';
        break;

      case beforeContent.indexOf('upper-roman') > -1:
        listStyleType = 'upper-roman';
        break;

      default:
        console.log('unknown list style type', beforeContent);
        break;
    }
    if (listStyleType) {
      listElement.setAttribute(ATTRIBUTE_LIST_STYLE_TYPE, listStyleType);
    }
  }
}

// This moves the styles of <li /> into its content <p />.
function patchPaddingStyle(listItemElement: HTMLElement): void {
  const {style, childNodes} = listItemElement;
  const {paddingTop, paddingBottom, lineHeight} = style;
  if (
    !EMPTY_CSS_VALUE.has(paddingBottom) &&
    !EMPTY_CSS_VALUE.has(paddingTop) &&
    !EMPTY_CSS_VALUE.has(lineHeight)
  ) {
    return;
  }

  const doc = listItemElement.ownerDocument;
  const frag = doc.createDocumentFragment();
  let contentIsInline = true;

  Array.from(childNodes).forEach(cn => {
    contentIsInline = contentIsInline &&
      INLINE_NODE_NAME_PATTERN.test(cn.nodeName);
    frag.appendChild(cn);
  });

  if (contentIsInline) {
    // Wrap all inline content with <p /> with the padding style applied.
    const pEl = doc.createElement('p');
    Object.assign(pEl.style, {
      lineHeight,
      paddingBottom,
      paddingTop,
    });
    pEl.appendChild(frag);
    listItemElement.appendChild(pEl);
  } else {
    // Unable to patch the style.
    listItemElement.appendChild(frag);
  }
}
