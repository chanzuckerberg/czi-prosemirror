// @flow

import {ATTRIBUTE_BOOKMARK_ID} from './BookmarkNodeSpec';

const BLOCK_NODE_NAME_PATTERN = /(P|H1|H2|H3|H4|H5|H6)/;

export default function patchAnchorElements(doc: Document): void {
  Array.from(doc.querySelectorAll('a[id]')).forEach(patchAnchorElement);
}

function patchAnchorElement(node: HTMLElement): void {
  const {id} = node;
  if (id && node.childElementCount === 0) {
    // This looks like a bookmark generated from Google Doc, will render
    // this as BookmarkNode.
    node.setAttribute(ATTRIBUTE_BOOKMARK_ID, id);
  }
  const nextNode = node.nextElementSibling;
  if (!nextNode) {
    return;
  }
  // If this is next to a block element, make that block element the bookmark.
  if (BLOCK_NODE_NAME_PATTERN.test(nextNode.nodeName)) {
    nextNode.insertBefore(node, nextNode.firstChild);
  }
}