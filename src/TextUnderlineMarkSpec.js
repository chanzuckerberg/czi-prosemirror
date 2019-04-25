// @flow

import type {MarkSpec} from './Types';

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const TextUnderlineMarkSpec: MarkSpec = {
  parseDOM: [
    {tag: 'u'},
    {
      style: 'text-decoration-line',
      getAttrs: value => {
        return value === 'underline' && null;
      },
    },
    {
      style: 'text-decoration',
      getAttrs: value => {
        return value === 'underline' && null;
      },
    },
  ],
  toDOM() {
    return ['u', 0];
  },
};

export default TextUnderlineMarkSpec;
