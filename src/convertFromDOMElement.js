// @flow

import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';
import {DOMParser} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';

export default function convertFromDOMElement(el: HTMLElement): EditorState {
  return EditorState.create({
    doc: DOMParser.fromSchema(EditorSchema).parse(el),
    plugins: EditorPlugins,
  });
}
