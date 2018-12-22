// @flow

import {EditorState} from 'prosemirror-state';

import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';
import createEmptyEditorState from './createEmptyEditorState';

export default function convertFromJSON(json: Object | string): EditorState {
  const schema = EditorSchema;
  const plugins = EditorPlugins;
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch (ex) {
      console.error('convertFromJSON:', ex);
      return createEmptyEditorState();
    }
  }

  if (!json || typeof json !== 'object') {
    console.error('convertFromJSON: invalid object', json);
    return createEmptyEditorState();
  }

  return EditorState.create({
    doc: schema.nodeFromJSON(json),
    schema,
    plugins,
  });
}
