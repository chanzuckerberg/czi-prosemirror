// @flow

import {EditorState} from 'prosemirror-state';

export default function isEditorStateEmpty(editorState: EditorState): boolean {
  return editorState.doc.nodeSize <= 6;
}