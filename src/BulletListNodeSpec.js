// @flow
import type {NodeSpec} from 'prosemirror';

const DEFAULT_DOM = ['ul', 0];

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const BulletListNodeSpec: NodeSpec = {
  name: 'bullet_list',
  group: 'block',
  content: 'list_item+',
  parseDOM: [{
    tag: 'ul',
  }],
  toDOM() {
    return DEFAULT_DOM;
  },
};

export default BulletListNodeSpec;
