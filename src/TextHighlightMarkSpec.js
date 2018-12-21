// @flow

import {Node} from 'prosemirror-model';

import toHexColor from './ui/toHexColor';

import type {MarkSpec} from './Types';

const TextHighlightMarkSpec: MarkSpec = {
  attrs: {
    highlightColor: '',
  },
  inline: true,
  group: 'inline',
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
