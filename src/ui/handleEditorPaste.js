// @flow

import {EditorView} from 'prosemirror-view';

import {uploadImageFiles} from '../ImageUploadPlaceholderPlugin';

// workaround to support ClipboardEvent as a valid type.
// https://github.com/facebook/flow/issues/1856
declare class ClipboardEvent extends Event {
  clipboardData: DataTransfer,
}

export default function handleEditorPaste(
  view: EditorView,
  event: ClipboardEvent,
): boolean {
  const {clipboardData} = event;
  if (!clipboardData) {
    return false;
  }
  const {files} = clipboardData;
  if (!files || !files.length) {
    return false;
  }
  const filesList = Array.from(files);

  if (uploadImageFiles(view, filesList)) {
    event.preventDefault();
    return true;
  }

  return false;
}