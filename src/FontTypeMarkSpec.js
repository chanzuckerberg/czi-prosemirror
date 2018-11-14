// @flow

import toHexColor from './ui/toHexColor';
import {MARK_TEXT_COLOR} from './MarkNames';
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
          name,
        };
      },
    },
  ],
  toDOM(node: Node) {
    const {name} = node.attrs;
    const style = name ? `font-family: ${name}` : '';
    return ['span', {style}, 0];
  },
};

export default FontTypeMarkSpec;
