// @flow
import * as EditorCommand from './EditorCommand';
import * as KeyMaps from './keymaps';
import * as ProsemirrorTables from 'prosemirror-tables';
import CursorPlaceholderPlugin from './CursorPlaceholderPlugin';
import EditorAttributesPlugin from './EditorAttributesPlugin';
import createEditorKeyMap from './createEditorKeyMap';
import EditorSchema from './EditorSchema';
import LinkTooltipPlugin from './LinkTooltipPlugin';
import SelectionPlaceholderPlugin from './SelectionPlaceholderPlugin';
import {Plugin} from 'prosemirror-state';
import {Schema} from 'prosemirror-model';
import {baseKeymap} from 'prosemirror-commands';
import {buildInputRules} from 'prosemirror-example-setup';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {schema} from 'prosemirror-schema-basic';

// import {PLUGINS} from './configs';

const {
  columnResizing,
  tableEditing,
} = ProsemirrorTables;

function buildPlugins(schema: Schema): Array<Plugin> {

  const plugins = [
    new EditorAttributesPlugin(),
    new CursorPlaceholderPlugin(),
    new SelectionPlaceholderPlugin(),
    new LinkTooltipPlugin(),

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
