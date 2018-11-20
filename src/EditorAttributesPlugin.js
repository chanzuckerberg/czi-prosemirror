// @flow
import {EditorState, Plugin} from 'prosemirror-state';

const SPEC = {
  props: {
    attributes: renderAttributes,
  },
};

function renderAttributes(editorState: EditorState): Object {
  const attrs = {
    'class': 'czi-prosemirror-editor',
  };
  return attrs;
}

class EditorAttributesPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

export default EditorAttributesPlugin;
