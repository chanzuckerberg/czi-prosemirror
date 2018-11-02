// @flow

import {EditorState} from 'prosemirror-state';
import {DOMParser} from 'prosemirror-model';

import {
  PLUGINS,
  SCHEMA,
} from '../src/configs';

export default function convertFromDOMelement(el: HTMLElement): EditorState {
  return EditorState.create({
    doc: DOMParser.fromSchema(SCHEMA).parse(el),
    plugins: PLUGINS,
  });
}
