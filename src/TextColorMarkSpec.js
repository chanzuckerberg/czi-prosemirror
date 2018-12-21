// @flow

import {Node} from 'prosemirror-model';

import toHexColor from './ui/toHexColor';

import type {MarkSpec} from './Types';

const TextColorMarkSpec: MarkSpec = {
  attrs: {
    color: '',
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'color',
      getAttrs: (color) => {
        return {
          color: toHexColor(color),
        };
      },
    },
  ],
  toDOM(node: Node) {
    const {color} = node.attrs;
    let style = '';
    if (color) {
      style += `color: ${color};`;
    }
    return [
      'span',
      {style},
      0,
    ];
  },
};

export default TextColorMarkSpec;
