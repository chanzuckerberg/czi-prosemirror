// @flow

import {Schema} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {Plugin} from 'prosemirror-state';

import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';
import createEmptyEditorState from './createEmptyEditorState';

export default function convertFromJSON(
  json: Object | string,
  schema: ?Schema,
  plugins: ?Array<Plugin>
): EditorState {
  const effectiveSchema = schema || EditorSchema;
  const effectivePlugins = plugins || EditorPlugins;
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch (ex) {
      console.error('convertFromJSON:', ex);
      return createEmptyEditorState(schema, plugins);
    }
  }

  if (!json || typeof json !== 'object') {
    console.error('convertFromJSON: invalid object', json);
    return createEmptyEditorState(schema, plugins);
  }

  return EditorState.create({
    doc: effectiveSchema.nodeFromJSON(json),
    schema: effectiveSchema,
    plugins: effectivePlugins,
  });
}
