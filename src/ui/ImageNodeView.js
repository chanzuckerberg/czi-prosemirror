// @flow

import './czi-image-view.css';
import CustomNodeView from './CustomNodeView';
import ImageAlignEditor from './ImageAlignEditor';
import ImageResizeBox from './ImageResizeBox';
import React from 'react';
import createPopUp from './createPopUp';
import cx from 'classnames';
import nullthrows from 'nullthrows';
import resolveImage from './resolveImage';
import uuid from './uuid';
import {EditorView, Decoration} from "prosemirror-view";
import {MIN_SIZE} from './ImageResizeBox';
import {Node} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {atAnchorBottomCenter} from './PopUpPosition';

import type {EditorRuntime} from '../Types';
import type {NodeViewProps} from './CustomNodeView';
import type {ImageAlignEditorValue} from './ImageAlignEditor';

const EMPTY_SRC = 'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function resolveURL(runtime: ?EditorRuntime, src: ?string): ?string {
  if (!runtime) {
    return src;
  }
  const {canProxyImageSrc, getProxyImageSrc} = runtime;
  if (src && canProxyImageSrc && getProxyImageSrc && canProxyImageSrc(src)) {
    return getProxyImageSrc(src);
  }
  return src;
}

class ImageViewBody extends React.PureComponent<any, any, any> {

  props: NodeViewProps;

  _alignEditor = null;
  _id = uuid();
  _mounted = false;

  state = {
    resolvedImage: null,
  };

  componentDidMount(): void {
    this._mounted = true;
    this._resolveImage();
    this._renderAlignEditor();
  }

  componentWillUnmount(): void {
    this._mounted = false;
    this._alignEditor && this._alignEditor.close();
  }

  componentDidUpdate(prevProps: NodeViewProps): void {
    const {resolvedImage} = this.state;
    const prevSrc = prevProps.node.attrs.src;
    const {editorView, node} = this.props;
    const {src, width, height, align} = node.attrs;

    if (prevSrc !== src) {
      // A new image is provided, resolve it.
      this._resolveImage();
      return;
    }

    if (
      resolvedImage &&
      resolvedImage.complete &&
      (resolvedImage.width !== width || resolvedImage.height !== height) &&
      width &&
      height
    ) {
      // Image is resized.
      this.setState({
        resolvedImage: {
          ...resolvedImage,
          width,
          height,
        },
      });
    }

    this._renderAlignEditor();
  }

  render(): React.Element<any> {
    // TODO: Resolve `readOnly`;
    const readOnly = false;
    const {node, selected} = this.props;
    const {resolvedImage} = this.state;
    const {attrs} = node;

    const {align, crop} = attrs;

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

    const resizeBox = active ?
      <ImageResizeBox
        height={height}
        onResizeEnd={this._onResizeEnd}
        width={width}
        src={src}
      /> :
      null;

    const imageStyle = {
      display: 'inline-block',
      height: height + 'px',
      left: '0',
      top: '0',
      width: width + 'px',
      position: 'relative',
    };

    const clipStyle = {};

    if (crop) {
      clipStyle.width = crop.width;
      clipStyle.height = crop.height;
      imageStyle.left = crop.left + 'px';
      imageStyle.top = crop.top + 'px';
    }

    return (
      <span
        className={className}
        data-active={active ? 'true' : null}
        data-src={src || ''}
        id={this._id}>
        <span
          className="czi-image-view-body-img-clip" style={clipStyle}>
          <span style={imageStyle}>
            <img
              alt=""
              className="czi-image-view-body-img"
              data-align={align}
              height={height}
              src={src || EMPTY_SRC}
              width={width}
            />
          </span>
        </span>
        {resizeBox}
      </span>
    );
  }

  _renderAlignEditor(): void {
    const el = document.getElementById(this._id);
    if (!el || el.getAttribute('data-active') !== 'true') {
      this._alignEditor && this._alignEditor.close();
      return;
    }

    const {node} = this.props;
    const editorProps = {
      value: node.attrs,
      onSelect: this._onAlignChange,
    };
    if (this._alignEditor) {
      this._alignEditor.update(editorProps);
    }  else {
      this._alignEditor = createPopUp(ImageAlignEditor, editorProps, {
        anchor: el,
        autoDismiss: false,
        position: atAnchorBottomCenter,
        onClose: () => {
          this._alignEditor = null;
        },
      });
    }
  }

  _resolveImage(): void {
    this.setState({resolveImage: null});
    const {editorView, node} = this.props;
    const {src} = this.props.node.attrs;
    const url = resolveURL(editorView.runtime, src);
    resolveImage(url).then(resolvedImage => {
      if (this._mounted && src === this.props.node.attrs.src) {
        this._mounted && this.setState({resolvedImage});
      }
    });
  }

  _onResizeEnd = (width: number, height: number): void => {
    const {getPos, node, editorView} = this.props;
    const pos = getPos();
    const attrs = {
      ...node.attrs,
      // TODO: Support UI for cropping later.
      crop: null,
      width,
      height,
    };

    let tr = editorView.state.tr;
    const {selection} = editorView.state;
    tr = tr.setNodeMarkup(pos, null, attrs);
    tr = tr.setSelection(selection);
    editorView.dispatch(tr);
  };

  _onAlignChange = (value: ?{align: ?string}): void => {
    if (!this._mounted) {
      return;
    }

    const align = value ? value.align : null;

    const {getPos, node, editorView} = this.props;
    const pos = getPos();
    const attrs = {
      ...node.attrs,
      align,
    };

    let tr = editorView.state.tr;
    const {selection} = editorView.state;
    tr = tr.setNodeMarkup(pos, null, attrs);
    tr = tr.setSelection(selection);
    editorView.dispatch(tr);
  };
}

class ImageNodeView extends CustomNodeView {

  // @override
  createDOMElement(): HTMLElement {
    const el = document.createElement('span');
    el.className = 'czi-image-view';
    this._updateDOM(el);
    return el;
  }

  // @override
  update(node: Node, decorations: Array<Decoration>): boolean {
    super.update(node, decorations);
    this._updateDOM(this.dom);
    return true;
  }

  // @override
  renderReactComponent(): React.Element<any> {
    return <ImageViewBody {...this.props} />;
  }

  _updateDOM(el: HTMLElement): void {
    const {align} = this.props.node.attrs;
    let className = 'czi-image-view';
    if (align) {
      className += ' align-' + align;
    }
    el.className = className;
  }
}

export default ImageNodeView;
