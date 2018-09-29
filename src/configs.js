'use strict';

import BulletListNodeSpec from './BulletListNodeSpec';
import HeadingCommand from './HeadingCommand';
import HistoryRedoCommand from './HistoryRedoCommand';
import HistoryUndoCommand from './HistoryUndoCommand';
import Keymap from 'browserkeymap';
import ListItemNodeSpec from './ListItemNodeSpec';
import ListToggleCommand from './ListToggleCommand';
import OrderedListNodeSpec from './OrderedListNodeSpec';
import {EditorState, Plugin} from 'prosemirror-state';
import {Schema, DOMParser} from 'prosemirror-model';
import {baseKeymap} from 'prosemirror-commands';
import {buildInputRules} from 'prosemirror-example-setup';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {menuBar} from 'prosemirror-menu';
import {schema} from 'prosemirror-schema-basic';
import {splitListItem} from 'prosemirror-schema-list';

import {
  KEY_REDO,
  KEY_UNDO,
  KEY_SPLIT_LIST_ITEM,
} from './keymaps';

type UserKeyCommand = (
  state: EditorState,
  dispatch: ?(tr: Transform) => void,
  view: ?EditorView,
) => void;

type UserKeyMap = {
  [key: string]: UserKeyCommand,
};

function buildKeymap(schema: Schema): UserKeyMap {
  const result = {...baseKeymap};
  result[KEY_REDO.common] = HISTORY_REDO.execute;
  result[KEY_UNDO.common] = HISTORY_UNDO.execute;
  if (schema.nodes.list_item) {
    result[KEY_SPLIT_LIST_ITEM.common] = splitListItem(schema.nodes.list_item);
  }
  return result;
}

function buildPlugins(schema: Schema): Array<Plugin> {

  const plugins = [
    buildInputRules(schema),
    dropCursor(),
    gapCursor(),
    history(),
    keymap(buildKeymap(schema)),
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

const nodes = [
  BulletListNodeSpec,
  ListItemNodeSpec,
  OrderedListNodeSpec,
].reduce((memo, spec) => { memo[spec.name] = spec; return memo;}, {});

export const EDITOR_SCHEMA = new Schema({
  nodes: schema.spec.nodes.append(nodes),
  marks: schema.spec.marks,
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

// Plugin
export const EDITOR_PLUGINS = buildPlugins(EDITOR_SCHEMA);

// EditorState
export const EDITOR_EMPTY_STATE = EditorState.create({
  schema: EDITOR_SCHEMA,
  plugins: EDITOR_PLUGINS,
});
