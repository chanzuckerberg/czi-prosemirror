// @flow

import {Node} from 'prosemirror-model';

import WebFontLoader from './WebFontLoader';

import type {MarkSpec} from './Types';

export const FONT_TYPE_NAMES = [
  // SERIF
  'Arial',
  'Arial Black',
  'Georgia',
  'Tahoma',
  'Times New Roman',
  'Times',
  'Verdana',
  // MONOSPACE
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace',
];

const RESOLVED_FONT_NAMES = new Set(FONT_TYPE_NAMES);

const FontTypeMarkSpec: MarkSpec = {
  attrs: {
    name: '',
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-family',
      getAttrs: name => {
        return {
          name: name ? name.replace(/[\"\']/g, '') : '',
        };
      },
    },
  ],

  toDOM(node: Node) {
    const {name} = node.attrs;
    const attrs = {};
    if (name) {
      if (!RESOLVED_FONT_NAMES.has(name)) {
        // TODO: Cache custom fonts and preload them earlier.
        RESOLVED_FONT_NAMES.add(name);
        // https://github.com/typekit/webfontloader
        WebFontLoader.load({google: {families: [name]}});
      }
      attrs.style = `font-family: ${name}`;
    }
    return ['span', attrs, 0];
  },
};

export default FontTypeMarkSpec;
