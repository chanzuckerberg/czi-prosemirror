// @flow
import type {NodeSpec} from 'prosemirror';

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const ListItemNodeSpec: NodeSpec = {
  name: 'list_item',
  content: 'paragraph block*',
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};

export default ListItemNodeSpec;
