// @flow

import toHexColor from './ui/toHexColor';
import {MARK_TEXT_COLOR} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

export const DEFAULT_FONT_PT_SIZE = 11;

// 1 pt	~= 1.3281472327365px
export const FONT_PT_SIZES = [11, 8, 9, 10, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];

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
