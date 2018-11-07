// @flow

import CustomButton from './CustomButton';
import React from 'react';
import clamp from './clamp';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {TABLE_INSERT_TABLE} from '../configs';
import {Transform} from 'prosemirror-transform';
import {fromHTMlElement} from './rects';

import './czi-prose-mirror.css';
import './czi-image-editor.css';

export type ImageEditorValue = {
  height: ?number,
  src: ?string,
  width: ?number,
};

const GUTTER_SIZE = 5;
const CELL_SIZE = 16;
const MAX_SIZE = 20;


class ImageEditor extends React.PureComponent<any, any, any> {
  props: {
    initialValue: ?ImageEditorValue,
    close: (val: ImageEditorValue) => void,
  };

  render(): React.Element<any> {
    return (
      <div className="czi-image-editor">
        <input type="text" />
      </div>
    );
  }

}

export default ImageEditor;
