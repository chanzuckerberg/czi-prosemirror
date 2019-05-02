// @flow

import {Node} from 'prosemirror-model';

import toCSSColor from './ui/toCSSColor';

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
      getAttrs: color => {
        return {
          color: toCSSColor(color),
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
    return ['span', {style}, 0];
  },
};

export default TextColorMarkSpec;
