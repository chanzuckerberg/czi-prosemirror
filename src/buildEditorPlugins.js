// @flow
import {baseKeymap} from 'prosemirror-commands';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {Schema} from 'prosemirror-model';
import {Plugin, PluginKey} from 'prosemirror-state';

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

    setPluginKey(buildInputRules(schema), 'InputRules'),
    setPluginKey(dropCursor(), 'DropCursor'),
    setPluginKey(gapCursor(), 'GapCursor'),
    history(),
    setPluginKey(keymap(createEditorKeyMap()), 'EditorKeyMap'),
    setPluginKey(keymap(baseKeymap), 'BaseKeymap'),
  ].concat(TablePlugins);

  return plugins;
}

// [FS] IRAD-1005 2020-07-07
// Upgrade outdated packages.
// set plugin keys so that to avoid duplicate key error when keys are assigned automatically.
function setPluginKey(plugin, key) {
  plugin.spec.key = new PluginKey(key + 'Plugin');
  plugin.key = plugin.spec.key.key;
  return plugin;
}
