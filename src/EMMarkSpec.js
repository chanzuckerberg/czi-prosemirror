// @flow

import {Node} from 'prosemirror-model';

import type {MarkSpec} from './Types';

const EM_DOM = ['em', 0];

const EMMarkSpec: MarkSpec = {
  parseDOM: [
    {tag: 'i'},
    {tag: 'em'},
    {style: 'font-style=italic'},
  ],
  toDOM() { return EM_DOM; }
};

export default EMMarkSpec;
