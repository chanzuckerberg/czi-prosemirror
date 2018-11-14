// @flow


import {EditorState} from 'prosemirror-state';
import convertFromDOMElement from './convertFromDOMElement';

export default function convertFromHTML(html: string): EditorState {
  // TODO: Replace thsi with getSafeDOM.
  const root = document.createElement('czi-prose-mirror-root');
  root.innerHTML = html
  return convertFromDOMElement(root);
}
