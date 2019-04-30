// @flow

import type {MarkSpec} from './Types';

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const StrikeMarkSpec: MarkSpec = {
  parseDOM: [
    {
      style: 'text-decoration',
      getAttrs: value => {
        return value === 'line-through' && null;
      },
    },
  ],
  toDOM() {
    const style = 'text-decoration: line-through';
    return ['span', {style}, 0];
  },
};

export default StrikeMarkSpec;
