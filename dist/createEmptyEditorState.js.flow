// @flow

import {EditorState} from 'prosemirror-state';
import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';

const EMPTY_DOC_JSON = {
  'type': 'doc',
  'content': [
    {
      'type': 'paragraph',
      'content': [
        {
          'type': 'text',
          'text': ' ',
        },
      ],
    },
  ],
};

const EDITOR_EMPTY_STATE = EditorState.create({
  doc: EditorSchema.nodeFromJSON(EMPTY_DOC_JSON),
  schema: EditorSchema,
  plugins: EditorPlugins,
});

export default function createEmptyEditorState(): EditorState {
  return EDITOR_EMPTY_STATE;
}
