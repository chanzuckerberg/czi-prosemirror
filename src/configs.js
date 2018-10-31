'use strict';

import BulletListNodeSpec from './BulletListNodeSpec';
import HeadingCommand from './HeadingCommand';
import HistoryRedoCommand from './HistoryRedoCommand';
import HistoryUndoCommand from './HistoryUndoCommand';
import Keymap from 'browserkeymap';
import ListIndentCommand from './ListIndentCommand';
import ListItemNodeSpec from './ListItemNodeSpec';
import ListSplitCommand from './ListSplitCommand';
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

import {
  BULLET_LIST,
  HEADING,
  ORDERED_LIST,
  LIST_ITEM,
  PARAGRAPH,
} from './NodeNames';

import {
  KEY_INDENT_LIST_ITEM_LESS,
  KEY_INDENT_LIST_ITEM_MORE,
  KEY_REDO,
  KEY_SPLIT_LIST_ITEM,
  KEY_UNDO,
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
  const result = {};
  result[KEY_INDENT_LIST_ITEM_LESS.common] = LIST_INDENT_LESS.execute;
  result[KEY_INDENT_LIST_ITEM_MORE.common] = LIST_INDENT_MORE.execute;
  result[KEY_REDO.common] = HISTORY_REDO.execute;
  result[KEY_SPLIT_LIST_ITEM.common] = LIST_SPLIT.execute;
  result[KEY_UNDO.common] = HISTORY_UNDO.execute;
  return result;
}

function buildPlugins(schema: Schema): Array<Plugin> {

  const plugins = [
    buildInputRules(schema),
    dropCursor(),
    gapCursor(),
    history(),
    keymap(buildKeymap(schema)),
    keymap(baseKeymap),
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

const nodes = {
  [BULLET_LIST]: BulletListNodeSpec,
  [LIST_ITEM]: ListItemNodeSpec,
  [ORDERED_LIST]: OrderedListNodeSpec,
};

export const SCHEMA = new Schema({
  nodes: schema.spec.nodes.append(nodes),
  // nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

// Command
export const H1 = new HeadingCommand(SCHEMA, 1);
export const H2 = new HeadingCommand(SCHEMA, 2);
export const H3 = new HeadingCommand(SCHEMA, 3);
export const H4 = new HeadingCommand(SCHEMA, 4);
export const H5 = new HeadingCommand(SCHEMA, 5);
export const H6 = new HeadingCommand(SCHEMA, 6);
export const HISTORY_REDO = new HistoryRedoCommand();
export const HISTORY_UNDO = new HistoryUndoCommand();
export const LIST_SPLIT = new ListSplitCommand(SCHEMA);
export const LIST_INDENT_MORE = new ListIndentCommand(SCHEMA, 1);
export const LIST_INDENT_LESS = new ListIndentCommand(SCHEMA, -1);
export const OL = new ListToggleCommand(SCHEMA, true);
export const UL = new ListToggleCommand(SCHEMA, false);

// Plugin
export const PLUGINS = buildPlugins(SCHEMA);

// EditorState
export const EDITOR_EMPTY_STATE = EditorState.create({
  schema: SCHEMA,
  plugins: PLUGINS,
});
