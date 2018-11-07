// @flow

import toHexColor from './ui/toHexColor';
import {MARK_TEXT_COLOR} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

const TextColorMarkSpec: MarkSpec = {
  attrs: {
    color: '',
  },
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
    const {color, backgroundColor} = node.attrs;
    let style = '';
    if (color) {
      style += `color: ${color};`;
    }
    if (backgroundColor) {
      style += `background-color: ${backgroundColor};`;
    }
    return [
      'span',
      {style},
      0,
    ];
  },
};

export default TextColorMarkSpec;
