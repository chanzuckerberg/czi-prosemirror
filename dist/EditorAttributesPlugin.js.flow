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
    'data-layout': editorState.doc.firstChild.attrs.layout,
  };
  return attrs;
}

class EditorAttributesPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

export default EditorAttributesPlugin;
