// @flow


import convertFromDOMElement from './convertFromDOMElement';
import normalizeHTML from './normalizeHTML';
import {EditorState} from 'prosemirror-state';

export default function convertFromHTML(html: string): EditorState {
  const root = document.createElement('html');
  const newHTML = normalizeHTML(html);
  root.innerHTML = newHTML;
  return convertFromDOMElement(root);
}
