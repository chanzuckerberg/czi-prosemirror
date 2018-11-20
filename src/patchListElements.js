// @flow

import clamp from './ui/clamp';
import convertToCSSPTValue from './convertToCSSPTValue';
import {ATTRIBUTE_INDENT, MAX_INDENT_LEVEL, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';

export default function patchListElements(doc: Document): void {
  Array.from(doc.querySelectorAll('ol, ul')).forEach(patchListElementsElement);
}

const INDENT_MARGIN_SIZE = 36;

function patchListElementsElement(listElement: HTMLElement): void {
  // If the children of `listElement` all have teh same marginLeft, assume
  // it to be indented.
  let marginLeft = null;
  const {parentElement, children} = listElement;
  if (parentElement && parentElement.nodeName === 'LI') {
    // TODO: Handle this later.
    console.error('nested list is not supported', listElement);
  }
  Array.from(children).some(child => {
    const {style} = child;
    const ml = style && style.marginLeft;
    if (marginLeft === null) {
      marginLeft = ml;
    } else if (ml !== marginLeft) {
      return true;
    }
  });
  if (marginLeft === null) {
    return;
  }
  const indent = toIndentValue(marginLeft);
  if (indent) {
    listElement.setAttribute(ATTRIBUTE_INDENT, String(indent));
  }
}

function toIndentValue(marginLeft: string): number {
  const ptValue = convertToCSSPTValue(marginLeft);
  return clamp(
    MIN_INDENT_LEVEL,
    Math.round(ptValue / INDENT_MARGIN_SIZE),
    MAX_INDENT_LEVEL,
  );
}
