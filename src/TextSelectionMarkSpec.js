// @flow

import toHexColor from './ui/toHexColor';
import {MARK_TEXT_HIGHLIGHT} from './MarkNames';
import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

// This mark is used for storing temporary selection state, do not show this to
// user.
const TextHighlightMarkSpec: MarkSpec = {
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

export default TextHighlightMarkSpec;
