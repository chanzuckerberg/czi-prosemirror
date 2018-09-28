'use strict';

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
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor()
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

export const EDITOR_SCHEMA = new Schema({
  // addListNodes(schema.spec.nodes, "paragraph block*", "block"),s
  nodes: schema.spec.nodes,
  marks: schema.spec.marks,
});

export const EDITOR_PLUGINS = buildPlugins({schema: EDITOR_SCHEMA});

export const EDITOR_EMPTY_STATE = EditorState.create({
  schema: EDITOR_SCHEMA,
  plugins: EDITOR_PLUGINS,
});
