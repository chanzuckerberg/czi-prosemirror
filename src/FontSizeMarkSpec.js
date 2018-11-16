// @flow

import {Node} from 'prosemirror-model';

import type {MarkSpec} from 'prosemirror';

const FontSizeMarkSpec: MarkSpec = {
  attrs: {
    pt: {default: null},
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
    const {pt} = node.attrs;
    const style = pt ? `font-size: ${pt}pt` : '';
    return ['span', {style}, 0];
  },
};

const SIZE_PATTERN = /([\d\.]+)(px|pt)/i;

function getAttrs(fontSize: string): Object {
  const attrs = {};
  if (!fontSize) {
    return attrs;
  }
  const matches = fontSize.match(SIZE_PATTERN);
  if (!matches) {
    return attrs;
  }
  let value = parseFloat(matches[1]);
  const unit = matches[2];
  if (!value || !unit) {
    return attrs;
  }
  if (unit === 'px') {
    value = 0.75 * value;
  }
  return {
    pt: value,
  };
}


export default FontSizeMarkSpec;
