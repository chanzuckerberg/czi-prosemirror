// @flow

import type {NodeSpec} from './Types';

export const ATTRIBUTE_BOOKMARK_ID = 'data-bookmark-id';

function getAttrs(dom: HTMLElement) {
  const id = dom.getAttribute(ATTRIBUTE_BOOKMARK_ID);
  return {
    id,
  };
}

const BookmarkNodeSpec: NodeSpec = {
  inline: true,
  attrs: {
    id: {default: null},
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{tag: `a[${ATTRIBUTE_BOOKMARK_ID}]`, getAttrs}],
  toDOM(node) {
    const {id} =  node.attrs;
    const attrs = id ? {
      [ATTRIBUTE_BOOKMARK_ID]: id,
      id,
    } : {};
    return ['a', attrs];
  },
};

export default BookmarkNodeSpec;
