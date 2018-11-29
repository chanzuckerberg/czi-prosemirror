// @flow

import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';
import {DOMParser} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {getAttrs} from './DocNodeSpec';

export default function convertFromDOMElement(el: HTMLElement): EditorState {
  const bodyEl = el.querySelector('body');
  const doc = DOMParser.fromSchema(EditorSchema).parse(el);

  if (bodyEl) {
    // Unfortunately the root node `doc` does not supoort `parseDOM`, thus
    // we'd have to assign its `attrs` manually.
    doc.attrs = getAttrs(bodyEl);
  }

  return EditorState.create({
    doc,
    plugins: EditorPlugins,
  });
}
