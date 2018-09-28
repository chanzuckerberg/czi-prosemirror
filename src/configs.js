'use strict';

import HistoryRedoCommand from './HistoryRedoCommand';
import HistoryUndoCommand from './HistoryUndoCommand';
import {EditorState, Plugin} from 'prosemirror-state';
import {Schema, DOMParser} from 'prosemirror-model';
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
  // addListNodes(schema.spec.nodes, "paragraph block*", "block"),s
  nodes: schema.spec.nodes,
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
