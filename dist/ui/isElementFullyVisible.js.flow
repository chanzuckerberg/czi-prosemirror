// @flow

import {fromHTMlElement} from './rects';

export default function isElementFullyVisible(el: HTMLElement): boolean {
  const {x, y, w, h} = fromHTMlElement(el);
  // Only checks the top-left point.
  const nwEl = w && h ? el.ownerDocument.elementFromPoint(x + 1, y + 1) : null;

  if (!nwEl) {
    return false;
  }

  if (nwEl === el) {
    return true;
  }

  if (el.contains(nwEl)) {
    return true;
  }

  return false;
}
