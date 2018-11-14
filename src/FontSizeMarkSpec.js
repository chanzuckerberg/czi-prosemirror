// @flow

import toHexColor from './ui/toHexColor';
import {MARK_TEXT_COLOR} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

const FontSizeMarkSpec: MarkSpec = {
  attrs: {
    size: '',
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-size',
      getAttrs: (size) => {
        return {
          size,
        };
      },
    },
  ],
  toDOM(node: Node) {
    const {size} = node.attrs;
    const style = size ? `font-size: ${size}` : '';
    return ['span', {style}, 0];
  },
};

export default FontSizeMarkSpec;
