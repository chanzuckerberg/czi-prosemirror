// @flow

import toHexColor from './ui/toHexColor';
import {MARK_TEXT_HIGHLIGHT} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

const TextHighlightMarkSpec: MarkSpec = {
  attrs: {
    highlightColor: '',
  },

  parseDOM: [
    {
      style: 'background-color',
      getAttrs: (backgroundColor) => {
        return {
          highlightColor: toHexColor(backgroundColor),
        };
      },
    },
  ],

  toDOM(node: Node) {
    const {highlightColor} = node.attrs;
    let style = '';
    if (highlightColor) {
      style += `background-color: ${highlightColor};`;
    }
    return [
      'span',
      {style},
      0,
    ];
  },
};

export default TextHighlightMarkSpec;
