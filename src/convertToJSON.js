// @flow

import {EditorState} from 'prosemirror-state';

export default function convertToJSON(editorState: EditorState): Object {
  return editorState.doc.toJSON();
}
