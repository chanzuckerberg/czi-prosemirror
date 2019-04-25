// @flow

import type {MarkSpec} from './Types';

const NO_WRAP_DOM = ['nobr', 0];

const TextNoWrapMarkSpec: MarkSpec = {
  parseDOM: [{tag: 'nobr'}],
  toDOM() {
    return NO_WRAP_DOM;
  },
};

export default TextNoWrapMarkSpec;
