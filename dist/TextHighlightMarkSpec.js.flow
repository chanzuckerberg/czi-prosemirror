// @flow

import {Node} from 'prosemirror-model';

import {isTransparent, toCSSColor} from './ui/toCSSColor';

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
        const color = toCSSColor(backgroundColor);
        return {
          highlightColor: isTransparent(color) ? '' : color,
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
