// @flow

import CustomNodeView from './CustomNodeView';
import ImageViewResizeBox from './ImageViewResizeBox';
import React from 'react';
import cx from 'classnames';
import resolveImage from './resolveImage';
import setImageSize from './../setImageSize';
import {EditorView} from "prosemirror-view";
import {MIN_SIZE} from './ImageViewResizeBox';
import {Node} from 'prosemirror-model';

import type {NodeViewProps} from './CustomNodeView';

import './czi-prose-mirror.css';
import './czi-image-view.css';


const EMPTY_SRC = 'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';


class ImageViewBody extends React.PureComponent<any, any, any> {

  props: NodeViewProps;

  _mounted = false;

  state = {
    resolvedImage: null,
  };

  componentDidMount(): void {
    this._mounted = true;
    const src = this.props.node.attrs.src;
    this._resolveImage();
  }

  componentWillUnmount(): void {
    this._mounted = false;
  }

  componentDidUpdate(prevProps: NodeViewProps): void {
    const prevSrc = prevProps.node.attrs.src;
    const src =  this.props.node.attrs.src;
    if (prevSrc !== src) {
      this._resolveImage();
    }
  }

  render(): React.Element<any> {
    const readOnly = false;
    const {node, selected} = this.props;
    const {resolvedImage} = this.state;
    const {attrs} = node;

    const active = selected &&
      !readOnly &&
      resolvedImage &&
      resolvedImage.complete;

    const src = resolvedImage && resolvedImage.complete ?
      resolvedImage.src :
      (attrs.src || EMPTY_SRC);

    const width = resolvedImage && resolvedImage.complete ?
      resolvedImage.width :
      (attrs.width || MIN_SIZE);

    const height = resolvedImage && resolvedImage.complete ?
      resolvedImage.height :
      (attrs.height || MIN_SIZE);

    const error = resolvedImage && !resolvedImage.complete;
    const loading = !resolveImage;

    const className = cx('czi-image-view-body', {
      active,
      error,
      loading,
    });

    const resizeBox = 1 || active ?
      <ImageViewResizeBox
        height={height}
        onResizeEnd={this._onResizeEnd}
        width={width}
      /> :
      null;

    const style = {
      height: height + 'px',
      width: width + 'px',
    };

    return (
      <span className={className} style={style}>
        <img
          alt=""
          className="czi-image-view-body-img"
          height={height}
          src={src || EMPTY_SRC}
          width={width}
        />
        {resizeBox}
      </span>
    );
  }

  _resolveImage(): void {
    const src = this.props.node.attrs.src;
    setTimeout(() => {
      resolveImage(src).then(resolvedImage => {
        if (this._mounted && src === this.props.node.attrs.src) {
          this._mounted && this.setState({resolvedImage});
        }
      });
    }, 150);
  }

  _onResizeEnd = (width: number, height: number): void => {
    const {getPos, node, editorView} = this.props;
    const pos = getPos();
    const attrs = {
      ...node.attrs,
      width,
      height,
    };
    let tr = editorView.state.tr;
    tr = tr.setNodeMarkup(pos, null, attrs);
    editorView.dispatch(tr);
  };
}

class ImageNodeView extends CustomNodeView {

  // @override
  createDOMElement(): HTMLElement {
    const el = document.createElement('span');
    el.className = 'czi-image-view';
    return el;
  }

  // @override
  renderReactComponent(): React.Element<any> {
    return <ImageViewBody {...this.props} />;
  }
}

export default ImageNodeView;
