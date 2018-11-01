'use strict';

import BulletListNodeSpec from './BulletListNodeSpec';
import HeadingCommand from './HeadingCommand';
import HistoryRedoCommand from './HistoryRedoCommand';
import HistoryUndoCommand from './HistoryUndoCommand';
import HorizontalRuleCommand from './HorizontalRuleCommand';
import Keymap from 'browserkeymap';
import ListIndentCommand from './ListIndentCommand';
import ListItemNodeSpec from './ListItemNodeSpec';
import ListSplitCommand from './ListSplitCommand';
import ListToggleCommand from './ListToggleCommand';
import OrderedListNodeSpec from './OrderedListNodeSpec';
import TableMoveToNextCellCommand from './TableMoveToNextCellCommand';
import TableMoveToPrevCellCommand from './TableMoveToPrevCellCommand';
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
import {tableEditing, columnResizing, tableNodes, fixTables} from 'prosemirror-tables';

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
  KEY_TABLE_MOVE_TO_NEXT_CELL,
  KEY_TABLE_MOVE_TO_PREV_CELL,
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
  result[KEY_TABLE_MOVE_TO_PREV_CELL.common] = TABLE_MOVE_TO_PREV_CELL.execute;
  result[KEY_TABLE_MOVE_TO_NEXT_CELL.common] = TABLE_MOVE_TO_NEXT_CELL.execute;
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

    // Tables
    // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
    columnResizing(),
    tableEditing(),
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
const nodes = schema.spec.nodes
  .append({
    [BULLET_LIST]: BulletListNodeSpec,
    [LIST_ITEM]: ListItemNodeSpec,
    [ORDERED_LIST]: OrderedListNodeSpec,
  })
  .append(tableNodes({
    // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: {
        default: null,
        // TODO: Move these to a table helper.
        getFromDOM(dom) {
          return dom.style.backgroundColor || null;
        },
        setDOMAttr(value, attrs) {
          if (value) {
            attrs.style = (attrs.style || '') + `background-color: ${value};`;
          }
        },
      },
    },
  }));

console.log(nodes.content);

export const SCHEMA = new Schema({
  nodes: nodes,
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
export const HR = new HorizontalRuleCommand(SCHEMA);
export const LIST_INDENT_LESS = new ListIndentCommand(SCHEMA, -1);
export const LIST_INDENT_MORE = new ListIndentCommand(SCHEMA, 1);
export const LIST_SPLIT = new ListSplitCommand(SCHEMA);
export const OL = new ListToggleCommand(SCHEMA, true);
export const TABLE_MOVE_TO_NEXT_CELL = new TableMoveToNextCellCommand(SCHEMA);
export const TABLE_MOVE_TO_PREV_CELL = new TableMoveToPrevCellCommand(SCHEMA);
export const UL = new ListToggleCommand(SCHEMA, false);

// Plugin
export const PLUGINS = buildPlugins(SCHEMA);

// EditorState
export const EDITOR_EMPTY_STATE = EditorState.create({
  schema: SCHEMA,
  plugins: PLUGINS,
});

// Note that Firefox will, by default, add various kinds of controls to
// editable tables, even though those don't work in ProseMirror. The only way
// to turn these off is globally, which you might want to do with the
// following code:
document.execCommand('enableObjectResizing', false, 'false');
document.execCommand('enableInlineTableEditing', false, 'false');
