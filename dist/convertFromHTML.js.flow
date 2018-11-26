// @flow


import convertFromDOMElement from './convertFromDOMElement';
import normalizeHTML from './normalizeHTML';
import {EditorState} from 'prosemirror-state';

export default function convertFromHTML(html: string): EditorState {
  // TODO: Replace thsi with getSafeDOM.
  const root = document.createElement('czi-prose-mirror-root');
  root.innerHTML = normalizeHTML(html);
  return convertFromDOMElement(root);
}
