// @flow

import clamp from './ui/clamp';
import convertToCSSPTValue from './convertToCSSPTValue';
import {ATTRIBUTE_CSS_BEFORE_CONTENT} from './patchStyleElements';
import {convertMarginLeftToIndentValue, ATTRIBUTE_INDENT, MAX_INDENT_LEVEL, MIN_INDENT_LEVEL, INDENT_MARGIN_PT_SIZE} from './ParagraphNodeSpec';
import {ATTRIBUTE_LIST_STYLE_TYPE} from './ListItemNodeSpec';

export default function patchListElements(doc: Document): void {
  Array.from(doc.querySelectorAll('ol, ul')).forEach(patchListElementsElement);
}

// This assumes that every 36pt maps to one indent level.
const CHAR_ZERO_WIDTH = '\u200B';
const CHAR_BULLET = '\u25cf';
const CHAR_CIRCLE = '\u25cb';
const CHAR_SQUARE = '\u25a0';
const CHAR_BOX = '\u274f';

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
  Array.from(children).some(child => {
    const {style} = child;
    const bc = child.getAttribute(ATTRIBUTE_CSS_BEFORE_CONTENT) || '';
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
