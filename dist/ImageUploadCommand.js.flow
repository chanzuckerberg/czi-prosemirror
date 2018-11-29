// @flow

import ImageSourceCommand from './ImageSourceCommand';
import ImageUploadEditor from './ui/ImageUploadEditor';
import React from 'react';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

class ImageUploadCommand extends ImageSourceCommand {

  isEnabled = (state: EditorState, view: ?EditorView): boolean => {
    if (!view) {
      return false;
    }

    const {runtime} = view;
    if (!runtime) {
      return false;
    }

    const {canUploadImage, uploadImage} = runtime;
    if (!canUploadImage || !uploadImage) {
      return false;
    }
    if (!canUploadImage()) {
      return false;
    }

    return this.__isEnabled(state, view);
  };

  getEditor(): Class<React.Component<any, any, any>> {
    return ImageUploadEditor;
  }
}
export default ImageUploadCommand;
