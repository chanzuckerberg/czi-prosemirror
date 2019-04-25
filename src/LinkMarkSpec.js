// @flow

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
      getAttrs: dom => {
        const href = dom.getAttribute('href');
        const target = href && href.indexOf('#') === 0 ? '' : 'blank';
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
          target,
        };
      },
    },
  ],
  toDOM(node) {
    return ['a', node.attrs, 0];
  },
};

export default LinkMarkSpec;
