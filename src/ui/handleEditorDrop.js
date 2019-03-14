// @flow

import {EditorView} from 'prosemirror-view';

import {uploadImageFiles} from '../ImageUploadPlaceholderPlugin';

// https://prosemirror.net/examples/upload/
export default function handleEditorDrop(
  view: EditorView,
  event: DragEvent,
): boolean {
  const {dataTransfer} = event;
  if (!dataTransfer) {
    return false;
  }
  const {files} = dataTransfer;
  if (!files || !files.length) {
    return false;
  }

  const filesList = Array.from(files);
  const coords = {x: event.clientX, y: event.clientY};
  if (uploadImageFiles(view, filesList, coords)) {
    event.preventDefault();
    return true;
  }
  return false;
}