// @flow

import {LIST_ITEM} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const ATTRIBUTE_LEVEL = 'data-level';
const DEFAULT_DOM = [
  'ul',
  {level: 1},
  0,
];

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const BulletListNodeSpec: NodeSpec = {
  attrs: {
    level: {
      default: 1,
    },
    identifier: {
      default: '',
    },
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ul',
    getAttrs(dom: HTMLElement) {
      const level = dom.hasAttribute(ATTRIBUTE_LEVEL) ?
        parseInt(dom.getAttribute(ATTRIBUTE_LEVEL), 10) :
        1;
      return {
        level,
      };
    },
  }],
  toDOM(node: Node) {
    const {level} = node.attrs;
    return level === 1 ?
      DEFAULT_DOM :
      [
        'ul',
        {
          [ATTRIBUTE_LEVEL]: level,
        },
        0,
      ];
  },
};

export default BulletListNodeSpec;
