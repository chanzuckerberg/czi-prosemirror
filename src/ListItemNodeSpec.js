// @flow

import type {NodeSpec} from './Types';

export const ATTRIBUTE_LIST_STYLE_TYPE = 'data-list-style-type';
export const ATTRIBUTE_LIST_STYLE_COLOR = 'data-list-style-color';

const ALIGN_PATTERN = /(left|right|center|justify)/;

function getAttrs(dom: HTMLElement) {
  const attrs = {};
  const {textAlign} = dom.style;
  let align = dom.getAttribute('data-align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  if (align) {
    attrs.align = align;
  }

  const color = dom.getAttribute(ATTRIBUTE_LIST_STYLE_COLOR);
  if (color) {
    attrs.color = color;
  }

  return attrs;
}

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const ListItemNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
    color: {default: null},
    id: {default: null},
    style: {default: null},
  },

  // NOTE that do not support nested lists `'paragraph block*'` because of
  // the complexity of dealing with indentation.
  content: 'paragraph',

  parseDOM: [{tag: 'li', getAttrs}],

  toDOM(node) {
    const attrs = {};
    const {align, color} = node.attrs;
    if (align) {
      attrs['data-align'] = align;
    }
    if (color) {
      attrs.style = `--czi-list-style-color: ${color}`;
    }
    return ['li', attrs, 0];
  },
};

export default ListItemNodeSpec;
