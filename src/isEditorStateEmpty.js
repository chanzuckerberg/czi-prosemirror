// @flow

import {EditorState} from 'prosemirror-state';

export default function isEditorStateEmpty(editorState: EditorState): boolean {
  if (editorState.doc.nodeSize < 10) {
    const text = editorState.doc.textContent;
    return !text || text === ' ';
  } else {
    return false;
  }
}
