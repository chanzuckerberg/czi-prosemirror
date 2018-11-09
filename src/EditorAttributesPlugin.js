// @flow
import {EditorState, Plugin} from 'prosemirror-state';

const SPEC = {
  props: {
    attributes: {
      'class': 'prose-mirror-editor',
      'data-prose-mirror-editor': 'true',
    },
  },
};

class EditorAttributesPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

export default EditorAttributesPlugin;
