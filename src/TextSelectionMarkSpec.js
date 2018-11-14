// @flow

import toHexColor from './ui/toHexColor';
import {MARK_TEXT_HIGHLIGHT} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

const TextSelectionMarkSpec: MarkSpec = {
  attrs: {
    id: '',
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      tag: 'czi-text-selection',
    },
  ],

  toDOM(node: Node) {
    return [
      'mark-text-selection',
      {'class': 'debug-mark-text-selection'},
      0,
    ];
  },
};

export default TextSelectionMarkSpec;
