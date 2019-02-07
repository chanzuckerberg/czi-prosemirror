// @flow
import {baseKeymap} from 'prosemirror-commands';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {Schema} from 'prosemirror-model';
import {Plugin} from 'prosemirror-state';
import * as ProsemirrorTables from 'prosemirror-tables';

import ContentPlaceholderPlugin from './ContentPlaceholderPlugin';
import CursorPlaceholderPlugin from './CursorPlaceholderPlugin';
import EditorPageLayoutPlugin from './EditorPageLayoutPlugin';
import EditorSchema from './EditorSchema';
import LinkTooltipPlugin from './LinkTooltipPlugin';
import SelectionPlaceholderPlugin from './SelectionPlaceholderPlugin';
import TableCellTooltipPlugin from './TableCellTooltipPlugin';
import buildInputRules from './buildInputRules';
import createEditorKeyMap from './createEditorKeyMap';

const {
  columnResizing,
  tableEditing,
} = ProsemirrorTables;

function buildPlugins(schema: Schema): Array<Plugin> {

  const plugins = [
    new ContentPlaceholderPlugin(),
    new CursorPlaceholderPlugin(),
    new EditorPageLayoutPlugin(),
    new LinkTooltipPlugin(),
    new SelectionPlaceholderPlugin(),
    new TableCellTooltipPlugin(),

    buildInputRules(schema),
    dropCursor(),
    gapCursor(),
    history(),

    keymap(createEditorKeyMap()),
    keymap(baseKeymap),

    // Tables
    // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
    columnResizing(),
    tableEditing(),
  ];

  return plugins;
}

// Plugin
const EditorPlugins = buildPlugins(EditorSchema);
export default EditorPlugins;
