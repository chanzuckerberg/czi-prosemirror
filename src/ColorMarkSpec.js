// @flow

import {Node} from 'prosemirror-model';
import {MARK_COLOR} from './MarkNames';

import type {MarkSpec} from 'prosemirror';

const ColorMarkSpec: MarkSpec = {
  attrs: {
    color: '',
  },
  parseDOM: [
    {style: 'color', getAttrs: value => value},
  ],
  toDOM(node: Node) {
    return [
      MARK_COLOR,
      {
        style: `color: ${node.attrs.color};`,
      },
      0,
    ];
  },
};

export default ColorMarkSpec;
