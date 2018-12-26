// @flow

import {collab} from 'prosemirror-collab';
import {EditorState} from 'prosemirror-state';

import EditorPlugins from '../src/EditorPlugins';
import EditorSchema from '../src/EditorSchema';
import {EMPTY_DOC_JSON} from '../src/createEmptyEditorState';

type IdStrict = number;

export default function createDemoColllabEditorState(
  version: number,
  userId: IdStrict,
  jsonState: ?Object,
): EditorState {
  const plugins = EditorPlugins.slice(0);
  plugins.push(collab({
    version: version || 0,
    clientID: userId,
  }));
  return EditorState.create({
    doc: EditorSchema.nodeFromJSON(jsonState || EMPTY_DOC_JSON),
    schema: EditorSchema,
    plugins,
  });
}