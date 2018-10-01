// @flow
import type {NodeSpec} from 'prosemirror';
import {Node} from 'prosemirror-model';

const DEFAULT_DOM = ['ol', 0];

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const OrderedListNodeSpec: NodeSpec = {
  attrs: {order: {default: 1}},
  name: 'ordered_list',
  group: 'block',
  content: 'list_item+',
  parseDOM: [{
    tag: 'ol',
    getAttrs(dom: HTMLElement) {
      const order = dom.hasAttribute('start') ?
        parseInt(dom.getAttribute('start'), 10) :
        1;
      return {order};
    },
  }],
  toDOM(node: Node) {
    return node.attrs.order == 1 ?
      DEFAULT_DOM :
      ['ol', {start: node.attrs.order}, 0];
  },
};

export default OrderedListNodeSpec;
