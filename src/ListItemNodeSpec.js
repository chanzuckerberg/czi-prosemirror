// @flow

import type {NodeSpec} from 'prosemirror';

const EMPTY_OBJECT = {};

function getAttrs(dom: HTMLElement) {
  const {textAlign} = dom.style;
  let align = dom.getAttribute('data-align') || textAlign || '';
  align = /(left|right|center|justify)/.test(align) ? align : null;
  return align ? {align} : EMPTY_OBJECT;
}

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const ListItemNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
    id: {default: null},
  },

  // NOTE that do not support nested lists `'paragraph block*'` because of
  // the complexity of dealing with indentation.
  content: 'paragraph',

  parseDOM: [{tag: 'li', getAttrs}],

  toDOM(node) {
    let {attrs} = node;
    if (attrs.align) {
      attrs = {'data-align': attrs.align};
    } else {
      attrs = EMPTY_OBJECT;
    }
    return ['li', attrs, 0];
  },
};

export default ListItemNodeSpec;
