// @flow

import {Node} from 'prosemirror-model';

import type {MarkSpec} from './Types';

const LinkMarkSpec: MarkSpec = {
  attrs: {
    href: {default: null},
    rel: {default: 'noopener noreferrer nofollow'},
    target: {default: 'blank'},
    title: {default: null},
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs: (dom) => {
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
        };
      },
    },
  ],
  toDOM(node) {
    return ['a', node.attrs, 0];
  },
};

export default LinkMarkSpec;
