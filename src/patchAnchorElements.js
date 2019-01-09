// @flow

import {ATTRIBUTE_BOOKMARK_ID} from './BookmarkNodeSpec';

const BLOCK_NODE_NAME_PATTERN = /(P|H1|H2|H3|H4|H5|H6)/;

export default function patchAnchorElements(doc: Document): void {
  Array.from(doc.querySelectorAll('a[id]')).forEach(patchAnchorElement);
  Array.from(
    doc.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
  ).forEach(patchHeaderElements);
}

function patchAnchorElement(node: HTMLElement): void {
  const {id} = node;
  if (id && id.indexOf('t.') !== 0 && node.childElementCount === 0) {
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

function patchHeaderElements(node: HTMLElement): void {
  const {id} = node;
  console.log('id1', id)
  if (id && id.indexOf('h.') === 0 && node.firstChild && node.firstChild.hasChildNodes()) {
    console.log('id2', id)
    // Heading tags have the id referenced directly on the element, so create
    // a proper anchor tag and insert it heading tag
    const anchorNode = document.createElement('a')
    anchorNode.setAttribute(ATTRIBUTE_BOOKMARK_ID, id);
    node.insertBefore(anchorNode, node.firstChild);
  }
}
