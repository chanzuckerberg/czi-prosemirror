// @flow

import ImageSourceCommand from './ImageSourceCommand';
import ImageURLEditor from './ui/ImageURLEditor';
import React from 'react';

class ImageUploadCommand extends ImageSourceCommand {
  getEditor(): Class<React.Component<any, any, any>> {
    return ImageURLEditor;
  }
}
export default ImageUploadCommand;
