'use strict';

import * as KeyMaps from './keymaps';
import * as NodeNames from './NodeNames';
import * as ProsemirrorTables from 'prosemirror-tables';
import BulletListNodeSpec from './BulletListNodeSpec';
import CodeBlockCommand from './CodeBlockCommand';
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
import TableCellColorCommand from './TableCellColorCommand';
import TableInsertCommand from './TableInsertCommand';
import TextColorCommand from './TextColorCommand';
import createCommand from './createCommand';
import {EditorState, Plugin} from 'prosemirror-state';
import {Schema, DOMParser} from 'prosemirror-model';
import {baseKeymap} from 'prosemirror-commands';
import {buildInputRules} from 'prosemirror-example-setup';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {schema} from 'prosemirror-schema-basic';

type UserKeyCommand = (
  state: EditorState,
  dispatch: ?(tr: Transform) => void,
  view: ?EditorView,
) => void;

type UserKeyMap = {
  [key: string]: UserKeyCommand,
};

// Note that Firefox will, by default, add various kinds of controls to
// editable tables, even though those don't work in ProseMirror. The only way
// to turn these off is globally, which you might want to do with the
// following code:
document.execCommand('enableObjectResizing', false, 'false');
document.execCommand('enableInlineTableEditing', false, 'false');

const {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  columnResizing,
  deleteColumn,
  deleteRow,
  deleteTable,
  fixTables,
  goToNextCell,
  mergeCells,
  setCellAttr,
  splitCell,
  tableEditing,
  tableNodes,
  toggleHeaderCell,
  toggleHeaderColumn,
  toggleHeaderRow,
} = ProsemirrorTables;

const {
  BULLET_LIST,
  HEADING,
  ORDERED_LIST,
  LIST_ITEM,
  PARAGRAPH,
} = NodeNames;

const {
  KEY_INDENT_LIST_ITEM_LESS,
  KEY_INDENT_LIST_ITEM_MORE,
  KEY_TABLE_MOVE_TO_NEXT_CELL,
  KEY_TABLE_MOVE_TO_PREV_CELL,
  KEY_REDO,
  KEY_SPLIT_LIST_ITEM,
  KEY_UNDO,
} = KeyMaps;

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
        attributes: {
          class: 'prose-mirror-editor',
          'data-prose-mirror-editor': 'true',
        },
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

// console.log(nodes.content);
const marks = schema.spec.marks.append({
  span: {
    attrs: {
      color: '',
    },
    parseDOM: [
      {style: 'color', getAttrs: value => value}
    ],
    toDOM(node) {
      return [
        'span',
        {
          style: `color: ${node.attrs.color};`,
        },
        0,
      ];
    },
  }
});

export const SCHEMA = new Schema({
  nodes,
  marks,
});

// Command

export const CODE = new CodeBlockCommand(SCHEMA);
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
export const TABLE_ADD_COLUMN_AFTER = createCommand(addColumnAfter);
export const TABLE_ADD_COLUMN_BEFORE = createCommand(addColumnBefore);
export const TABLE_ADD_ROW_AFTER = createCommand(addRowAfter);
export const TABLE_ADD_ROW_BEFORE = createCommand(addRowBefore);
export const TABLE_CELL_COLOR = new TableCellColorCommand(SCHEMA);
export const TABLE_DELETE_COLUMN = createCommand(deleteColumn);
export const TABLE_DELETE_ROW = createCommand(deleteRow);
export const TABLE_DELETE_TABLE = createCommand(deleteTable);
export const TABLE_INSERT_TABLE = new TableInsertCommand(SCHEMA);
export const TABLE_MERGE_CELLS = createCommand(mergeCells);
export const TABLE_MOVE_TO_NEXT_CELL = createCommand(goToNextCell(1));
export const TABLE_MOVE_TO_PREV_CELL = createCommand(goToNextCell(-1));
export const TABLE_SPLIT_CELL = createCommand(splitCell);
export const TABLE_TOGGLE_HEADER_CELL = createCommand(toggleHeaderCell);
export const TABLE_TOGGLE_HEADER_COLUMN = createCommand(toggleHeaderColumn);
export const TABLE_TOGGLE_HEADER_ROW = createCommand(toggleHeaderRow);
export const TEXT_COLOR = new TextColorCommand(SCHEMA);
export const UL = new ListToggleCommand(SCHEMA, false);

// Plugin
export const PLUGINS = buildPlugins(SCHEMA);

// EditorState
export const EDITOR_EMPTY_STATE = EditorState.create({
  schema: SCHEMA,
  plugins: PLUGINS,
});
