// @flow

import {EditorState} from 'prosemirror-state';
import convertFromHTML from './convertFromHTML';
import convertDraftJSToHTML from './convertDraftJSToHTML';

export default function convertFromDraftJS(content: any): EditorState {
  const html = convertDraftJSToHTML(content);
  return convertFromHTML(html);
}
