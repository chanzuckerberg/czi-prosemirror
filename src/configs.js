'use strict';

import HeadingCommand from './HeadingCommand';
import HistoryRedoCommand from './HistoryRedoCommand';
import HistoryUndoCommand from './HistoryUndoCommand';
import ListToggleCommand from './ListToggleCommand';
import {EditorState, Plugin} from 'prosemirror-state';
import {Schema, DOMParser} from 'prosemirror-model';
import {addListNodes} from 'prosemirror-schema-list';
import {baseKeymap} from 'prosemirror-commands';
import {buildInputRules, buildKeymap} from 'prosemirror-example-setup';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {menuBar} from 'prosemirror-menu';
import {schema} from 'prosemirror-schema-basic';

function buildPlugins(options: Object): Array<Plugin> {
  const plugins = [
    buildInputRules(options.schema),
    dropCursor(),
    gapCursor(),
    history(),
    keymap(baseKeymap),
    keymap(buildKeymap(options.schema, options.mapKeys)),
  ];
  plugins.push(
    new Plugin({
      props: {
        attributes: {class: 'prose-mirror-editor'}
      },
    }),
  );
  return plugins;
}

// Schema
export const EDITOR_SCHEMA = new Schema({
  // https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

// Plugin
export const EDITOR_PLUGINS = buildPlugins({schema: EDITOR_SCHEMA});

// EditorState
export const EDITOR_EMPTY_STATE = EditorState.create({
  schema: EDITOR_SCHEMA,
  plugins: EDITOR_PLUGINS,
});

// Command
export const HISTORY_UNDO = new HistoryUndoCommand();
export const HISTORY_REDO = new HistoryRedoCommand();
export const H1 = new HeadingCommand(EDITOR_SCHEMA, 1);
export const H2 = new HeadingCommand(EDITOR_SCHEMA, 2);
export const H3 = new HeadingCommand(EDITOR_SCHEMA, 3);
export const H4 = new HeadingCommand(EDITOR_SCHEMA, 4);
export const H5 = new HeadingCommand(EDITOR_SCHEMA, 5);
export const H6 = new HeadingCommand(EDITOR_SCHEMA, 6);
export const OL = new ListToggleCommand(EDITOR_SCHEMA, true);
export const UL = new ListToggleCommand(EDITOR_SCHEMA, false);
