// @flow

import {Node} from 'prosemirror-model';

import toHexColor from './ui/toHexColor';

import type {MarkSpec} from './Types';

const TextHighlightMarkSpec: MarkSpec = {
  attrs: {
    highlightColor: '',
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      tag: 'span[style*=background-color]',
      getAttrs: (dom: HTMLElement) => {
        const {backgroundColor} = dom.style;
        return {
          highlightColor: toHexColor(backgroundColor),
        };
      },
    },
  ],

  toDOM(node: Node) {
    const {highlightColor} = node.attrs;
    let style = '';
    if (highlightColor) {
      style += `background-color: ${highlightColor};`;
    }
    return [
      'span',
      {style},
      0,
    ];
  },
};

export default TextHighlightMarkSpec;
