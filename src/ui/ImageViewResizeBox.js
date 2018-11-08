// @flow

import CustomNodeView from './CustomNodeView';
import React from 'react';
import cx from 'classnames';
import resolveImage from './resolveImage';
import {EditorView} from "prosemirror-view";
import {Node} from 'prosemirror-model';

import type {NodeViewProps} from './CustomNodeView';

type Props = {
  width: number,
  height: number,
};

type State = {
  currentWidth: number,
  currentHeight: number,
};

import './czi-prose-mirror.css';
import './czi-image-view-resize-box.css';

const ResizeDirection = {
  TOP: 1,
  TOP_RIGHT: 2,
  RIGHT: 3,
  BOTTOM_RIGHT: 4,
  BOTTOM: 5,
  BOTTOM_LEFT: 6,
  LEFT: 6,
  TOP_LEFT: 7,
};

export const MIN_SIZE = 50;

class ImageViewResizeBox extends React.PureComponent<any, any, any> {
  props: Props;

  state: State = {
    currentWidth: this.props.width,
    currentHeight: this.props.height,
  };

  render(): React.Element<any> {
    const {currentWidth, currentHeight} = this.state;

    const style = {
      width: currentWidth + 'px',
      height: currentHeight + 'px',
    };

    return (
      <div style={style} className="czi-image-view-resize-box">


      </div>
    );
  }
}

export default ImageViewResizeBox;
