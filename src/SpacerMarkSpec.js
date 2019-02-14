// @flow

import {Node} from 'prosemirror-model';

import type {MarkSpec} from './Types';

export const DOM_ATTRIBUTE_SIZE = 'data-spacer-size';
export const SPACER_SIZE_TAB = 'tab';

const SpacerMarkSpec: MarkSpec = {
  attrs: {
    size: {default: SPACER_SIZE_TAB},
  },
  defining: true,
  draggable: false,
  excludes: '_',
  group: 'inline',
  inclusive: false,
  inline: true,
  spanning: false,
  parseDOM: [
    {
      tag: `span[${DOM_ATTRIBUTE_SIZE}]`,
      getAttrs: (el) => {
        return {
          size: el.getAttribute(DOM_ATTRIBUTE_SIZE) || SPACER_SIZE_TAB,
        };
      },
    },
  ],
  toDOM(node: Node) {
    const {size} = node.attrs;
    return [
      'span',
      {
        [DOM_ATTRIBUTE_SIZE]: size,
      },
      0,
    ];
  },
};

export default SpacerMarkSpec;
