// @flow
import type {NodeSpec} from 'prosemirror';

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const OrderedListNodeSpec: NodeSpec = {
  name: 'ordered_list',
  group: 'block',
  content: 'list_item+',
  parseDOM: [{ tag: 'ul' }],
  toDOM() {
    return ['ul', 0];
  },
};

export default OrderedListNodeSpec;
