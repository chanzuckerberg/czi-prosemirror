// @flow

import {Node} from 'prosemirror-model';

import type {MarkSpec} from './Types';

const STRONG_DOM = ['strong', 0];

const CSS_BOLD_PATTERN = /^(bold(er)?|[5-9]\d{2,})$/;

const StrongMarkSpec: MarkSpec = {
  parseDOM: [
    {tag: 'strong'},
     // This works around a Google Docs misbehavior where
     // pasted content will be inexplicably wrapped in `<b>`
     // tags with a font-weight normal.
    {tag: 'b', getAttrs: node => node.style.fontWeight != 'normal' && null},
    {style: 'font-weight', getAttrs: value => CSS_BOLD_PATTERN.test(value) && null},
  ],
  toDOM() { return STRONG_DOM; },
};

export default StrongMarkSpec;
