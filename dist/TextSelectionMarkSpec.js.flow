// @flow

import {Node} from 'prosemirror-model';

import type {MarkSpec} from './Types';

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
      'czi-text-selection',
      {'class': 'czi-text-selection'},
      0,
    ];
  },
};

export default TextSelectionMarkSpec;
