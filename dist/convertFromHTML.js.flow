// @flow

import {Schema} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {Plugin} from 'prosemirror-state';

import convertFromDOMElement from './convertFromDOMElement';
import normalizeHTML from './normalizeHTML';

export default function convertFromHTML(
  html: string,
  schema: ?Schema,
  plugins: ?Array<Plugin>,
): EditorState {
  const root = document.createElement('html');
  const newHTML = normalizeHTML(html);
  root.innerHTML = newHTML;
  return convertFromDOMElement(root, schema, plugins);
}
