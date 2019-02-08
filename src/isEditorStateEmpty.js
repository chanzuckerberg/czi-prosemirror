// @flow

import {EditorState} from 'prosemirror-state';

export default function isEditorStateEmpty(editorState: EditorState): boolean {
  const {doc} = editorState;
  const {nodeSize} = doc;
  if (nodeSize < 2) {
    const text = doc.textContent;
    return !text || text === ' ';
  } else if (nodeSize < 10) {
    let isEmpty = true;
    doc.nodesBetween(0, doc.nodeSize - 2, (node, ii) => {
      if (isEmpty) {
        const nodeType = node.type;
        if (nodeType.isAtom) {
          // e.g. Image, Video...etc.
          isEmpty = false;
        } else if (nodeType.isText) {
          const text = doc.textContent;
          isEmpty = !text || text === ' ';
        }
      }
      return isEmpty;
    });
    return isEmpty;
  } else {
    return false;
  }
}
