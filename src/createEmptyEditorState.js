// @flow

import {EditorState} from 'prosemirror-state';
import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';

const EDITOR_EMPTY_STATE = EditorState.create({
  schema: EditorSchema,
  plugins: EditorPlugins,
});

export default function createEmptyEditorState(): EditorState {
  return EDITOR_EMPTY_STATE;
}
