// @flow

import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';
import {DOMParser} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';

export default function convertFromDOMElement(el: HTMLElement): EditorState {
  const doc =  DOMParser.fromSchema(EditorSchema).parse(el);
  console.log(doc);
  return EditorState.create({
    doc: doc,
    plugins: EditorPlugins,
  });
}
