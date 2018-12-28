// @flow

import {Node} from 'prosemirror-model';

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
      getAttrs: (name) => {
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
      let WebFontLoader;
      if (typeof window !== 'undefined') {
        // WebFontLoader is for web only, its module can't be required
        // at server-side environment. Thus we'd get it from the global window
        // instead.
        // `window.__proseMirrorWebFontLoader` is defined at `Editor.js`.
        // See https://github.com/typekit/webfontloader/issues/383
        WebFontLoader = window.__proseMirrorWebFontLoader;
      }
      if (WebFontLoader && !RESOLVED_FONT_NAMES.has(name)) {
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
