// @flow

import Color from 'color';
import {MARK_TEXT_COLOR} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

const TextColorMarkSpec: MarkSpec = {
  attrs: {
    color: '',
  },
  parseDOM: [
    {style: 'color', getAttrs: value => value},
  ],
  toDOM(node: Node) {
    const color = node.attrs.color;
    let hex = '';
    if (color) {
      hex = Color(color).hex();
    }
    return [
      MARK_TEXT_COLOR,
      {
        style: `color: ${hex};`,
      },
      0,
    ];
  },
};

export default TextColorMarkSpec;
