// @flow

import { Node } from 'prosemirror-model';

import { toClosestFontPtSize } from './toClosestFontPtSize';

import type { MarkSpec } from './Types';

const FontSizeMarkSpec: MarkSpec = {
  attrs: {
    pt: { default: null },
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-size',
      getAttrs: getAttrs,
    },
  ],
  toDOM(node: Node) {
    const { pt } = node.attrs;
    const domAttrs = pt
      ? {
        style: `font-size: ${pt}pt;`,
        class: 'czi-font-size-mark',
      }
      : null;

    return ['span', domAttrs, 0];
  },
};

function getAttrs(fontSize: string): Object {
  const attrs = {};
  if (!fontSize) {
    return attrs;
  }

  const ptValue = toClosestFontPtSize(fontSize);
  if (!ptValue) {
    return attrs;
  }
  return {
    pt: ptValue,
  };
}

export default FontSizeMarkSpec;
