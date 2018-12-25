import {baseKeymap} from 'prosemirror-commands';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {Schema} from 'prosemirror-model';
import {Plugin} from 'prosemirror-state';
// @flow
import * as ProsemirrorTables from 'prosemirror-tables';

import ContentPlaceholderPlugin from './ContentPlaceholderPlugin';
import CursorPlaceholderPlugin from './CursorPlaceholderPlugin';
import EditorAttributesPlugin from './EditorAttributesPlugin';
import EditorSchema from './EditorSchema';
import LinkTooltipPlugin from './LinkTooltipPlugin';
import SelectionPlaceholderPlugin from './SelectionPlaceholderPlugin';
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
    new EditorAttributesPlugin(),
    new LinkTooltipPlugin(),
    new SelectionPlaceholderPlugin(),

    buildInputRules(schema),
    dropCursor(),
    gapCursor(),
    history({preserveItems: true}),

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
