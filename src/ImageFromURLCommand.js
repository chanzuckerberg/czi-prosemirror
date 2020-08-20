// @flow

import * as React from 'react';

import ImageSourceCommand from './ImageSourceCommand';
import ImageURLEditor from './ui/ImageURLEditor';

class ImageFromURLCommand extends ImageSourceCommand {
  getEditor(): Class<React.Component<any, any>> {
    return ImageURLEditor;
  }
}

export default ImageFromURLCommand;
