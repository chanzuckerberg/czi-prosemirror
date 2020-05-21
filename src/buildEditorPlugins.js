// @flow
import {baseKeymap} from 'prosemirror-commands';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {Schema} from 'prosemirror-model';
import {Plugin} from 'prosemirror-state';

import ContentPlaceholderPlugin from './ContentPlaceholderPlugin';
import CursorPlaceholderPlugin from './CursorPlaceholderPlugin';
import EditorPageLayoutPlugin from './EditorPageLayoutPlugin';
import ImageUploadPlaceholderPlugin from './ImageUploadPlaceholderPlugin';
import LinkTooltipPlugin from './LinkTooltipPlugin';
import SelectionPlaceholderPlugin from './SelectionPlaceholderPlugin';
import TablePlugins from './TablePlugins';
import buildInputRules from './buildInputRules';
import createEditorKeyMap from './createEditorKeyMap';

// Creates the default plugin for the editor.
export default function buildEditorPlugins(schema: Schema): Array<Plugin> {
  const plugins = [
    new ContentPlaceholderPlugin(),
    new CursorPlaceholderPlugin(),
    new EditorPageLayoutPlugin(),
    new ImageUploadPlaceholderPlugin(),
    new LinkTooltipPlugin(),
    new SelectionPlaceholderPlugin(),

    buildInputRules(schema),
    dropCursor(),
    gapCursor(),
    history(),
    keymap(createEditorKeyMap()),
    keymap(baseKeymap),
  ].concat(TablePlugins);

  return plugins;
}
