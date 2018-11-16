// @flow

import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

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
      attrs.style = `font-family: ${name}`;
    }
    return ['span', attrs, 0];
  },
};

export default FontTypeMarkSpec;
