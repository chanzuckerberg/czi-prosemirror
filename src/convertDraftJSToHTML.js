// @noflow

import {EditorState as DraftJSEditorstate} from 'draft-js';
import {convertToHTML} from 'draft-convert';
import convertFromRaw from 'docs-editor/dist/convertFromRaw';

export default function convertDraftJSToHTML(content: any): string {
  let editorState;
  let error = 'unknown';
  if (typeof content === 'string') {
    // assume raw JSON string.
    try {
      const json = JSON.parse(content);
      editorState = convertFromRaw(json);
    } catch (ex) {
      error = `Invalid JSON string ${ex.message}`;
    }
  } else if (content instanceof DraftJSEditorstate) {
    editorState = content;
  } else if (Object.prototype.toString.call(content) === '[object Object]') {
    // Raw JS Object.
    editorState = convertFromRaw(content);
  } else {
    error = `Unsupported content ${content}`;
  }

  if (editorState) {
    // TODO (Alex): This is not complete, please see
    // https://github.com/HubSpot/draft-convert
    return convertToHTML(editorState.getCurrentContent());
  }

  return `<p><span style="color: #ff0000">Error ${error}</span></p>`;
}
