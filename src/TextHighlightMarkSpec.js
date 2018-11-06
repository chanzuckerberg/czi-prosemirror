// @flow

import Color from 'color';
import {MARK_TEXT_HIGHLIGHT} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

const TextHighlightMarkSpec: MarkSpec = {
  attrs: {
    highlight: '',
  },
  parseDOM: [
    {style: 'backgroundColor', getAttrs: value => value},
  ],
  toDOM(node: Node) {
    const color = node.attrs.highlight;
    let hex = '';
    if (color) {
      hex = Color(color).hex();
    }
    return [
      MARK_TEXT_HIGHLIGHT,
      {
        style: `background-color: ${hex};`,
      },
      0,
    ];
  },
};

export default TextHighlightMarkSpec;
