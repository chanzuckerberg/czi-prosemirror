// @flow

import clamp from './ui/clamp';
import {ATTRIBUTE_INDENT, MAX_INDENT_LEVEL, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';

export default function patchLists(doc: Document): void {
  Array.from(doc.querySelectorAll('ol, ul')).forEach(patchListElement);
}

const SIZE_PATTERN = /([\d\.]+)(px|pt)/i;
const INDENT_MARGIN_SIZE = 36;

function patchListElement(listElement: HTMLElement): void {
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
  const ptValue = toPTValue(marginLeft);
  return clamp(
    MIN_INDENT_LEVEL,
    Math.round(ptValue / INDENT_MARGIN_SIZE),
    MAX_INDENT_LEVEL,
  );
}

function toPTValue(styleValue: string): number {
  const matches = styleValue.match(SIZE_PATTERN);
  if (!matches) {
    return 0;
  }
  let value = parseFloat(matches[1]);
  const unit = matches[2];
  if (!value || !unit) {
    return 0;
  }
  if (unit === 'px') {
    value = 0.75292857 * value;
  }
  return value;
}
