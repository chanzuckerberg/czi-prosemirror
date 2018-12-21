// @flow

import {EditorState, Plugin} from 'prosemirror-state';

import {ATTRIBUTE_LAYOUT, LAYOUT} from './DocNodeSpec';

const SPEC = {
  props: {
    attributes: renderAttributes,
  },
};

function renderAttributes(editorState: EditorState): Object {
  const {doc} = editorState;
  const attrs: Object = {
    'class': 'czi-prosemirror-editor czi-vars',
  };

  const {width, padding, layout} = doc.attrs;

  let style = '';
  if (width) {
    // Use custom width (e.g. imported from google doc).
    style += `width: ${width}pt;`;
    if (padding) {
      style += `padding-left: ${padding}pt;`;
      style += `padding-right: ${padding}pt;`;
    }
    attrs.style = style;
  } else {
    attrs[ATTRIBUTE_LAYOUT] = layout || LAYOUT.US_LETTER_PORTRAIT;
  }
  return attrs;
}

// Unfortunately the root node `doc` does not supoort `toDOM`, thus
// we'd have to assign its `attributes` manually.
class EditorAttributesPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

export default EditorAttributesPlugin;
