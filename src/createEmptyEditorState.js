// @flow

import {EditorState} from 'prosemirror-state';
import {Plugin} from 'prosemirror-state';

import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';

type Config = {
  plugins?: ?Array<Plugin>,
};

export const EMPTY_DOC_JSON = {
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

export default function createEmptyEditorState(config: ?Config): EditorState {
  if (config && config.plugins) {
    return EditorState.create({
      doc: EditorSchema.nodeFromJSON(EMPTY_DOC_JSON),
      schema: EditorSchema,
      plugins: EditorPlugins.concat(config.plugins),
    });
  }
  return EDITOR_EMPTY_STATE;
}
