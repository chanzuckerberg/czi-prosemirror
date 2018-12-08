// @flow

import './czi-image-view.css';
import CustomNodeView from './CustomNodeView';
import ImageInlineEditor from './ImageInlineEditor';
import ImageResizeBox from './ImageResizeBox';
import React from 'react';
import ReactDOM from 'react-dom';
import ResizeObserver from './ResizeObserver';
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
import type {ImageInlineEditorValue} from './ImageInlineEditor';
import type {NodeViewProps} from './CustomNodeView';
import type {ResizeObserverEntry} from './ResizeObserver';

const EMPTY_SRC = 'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Get the maxWidth that the image could be resized to.
function getMaxResizeWidth(el: any): number {
  // Ideally, the image should bot be wider then its containing element.
  let node: any = el.parentElement;
  while (node && !node.offsetParent) {
    node = node.parentElement;
  }
  if (
    node &&
    node.offsetParent &&
    node.offsetParent.offsetWidth &&
    node.offsetParent.offsetWidth > 0
  ) {
    return node.offsetParent.offsetWidth;
  }
  // Let the image resize freely.
  return 100000000;
}

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

  _body = null;
  _id = uuid();
  _inlineEditor = null;
  _mounted = false;

  state = {
    maxWidth: NaN,
    resolvedImage: null,
  };

  componentDidMount(): void {
    this._mounted = true;
    this._resolveImage();
    this._renderInlineEditor();
  }

  componentWillUnmount(): void {
    this._mounted = false;
    this._inlineEditor && this._inlineEditor.close();
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

    this._renderInlineEditor();
  }

  render(): React.Element<any> {
    // TODO: Resolve `readOnly`;
    const readOnly = false;
    const {node, selected, focused} = this.props;
    const {resolvedImage, maxWidth} = this.state;
    const {attrs} = node;

    const {align, crop} = attrs;

    const active = focused &&
      !readOnly &&
      resolvedImage &&
      resolvedImage.complete;

    const src = resolvedImage && resolvedImage.complete ?
      resolvedImage.src :
      (attrs.src || EMPTY_SRC);

    let width = resolvedImage && resolvedImage.complete ?
      resolvedImage.width :
      (attrs.width || MIN_SIZE);

    let height = resolvedImage && resolvedImage.complete ?
      resolvedImage.height :
      (attrs.height || MIN_SIZE);

    const error = resolvedImage && !resolvedImage.complete;
    const loading = !resolveImage;

    const className = cx('czi-image-view-body', {
      active,
      error,
      focused,
      loading,
      selected,
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
    } else if (
      !active &&
      maxWidth &&
      resolvedImage &&
      resolvedImage.complete &&
      width > maxWidth
    ) {
      // When image is not being edited, it should automatically fit to its
      // containing space.
      const rr = width / height;
      width = Math.round(maxWidth);
      height = Math.round(maxWidth / rr);
      imageStyle.width = width + 'px';
      imageStyle.height = height + 'px';
    }

    return (
      <span
        className={className}
        data-active={active ? 'true' : null}
        data-src={src || ''}
        id={this._id}
        ref={this._onBodyRef}>
        <span
          className="czi-image-view-body-img-clip" style={clipStyle}>
          <span style={imageStyle}>
            <img
              alt=""
              className="czi-image-view-body-img"
              data-align={align}
              data-src={src}
              height={height}
              id={`${this._id}-img`}
              onLoad={this._onImageLoad}
              src={src || EMPTY_SRC}
              width={width}
            />
          </span>
        </span>
        {resizeBox}
      </span>
    );
  }

  _renderInlineEditor(): void {
    const el = document.getElementById(this._id);
    if (!el || el.getAttribute('data-active') !== 'true') {
      this._inlineEditor && this._inlineEditor.close();
      return;
    }

    const {node} = this.props;
    const editorProps = {
      value: node.attrs,
      onSelect: this._onChange,
    };
    if (this._inlineEditor) {
      this._inlineEditor.update(editorProps);
    }  else {
      this._inlineEditor = createPopUp(ImageInlineEditor, editorProps, {
        anchor: el,
        autoDismiss: false,
        position: atAnchorBottomCenter,
        onClose: () => {
          this._inlineEditor = null;
        },
      });
    }
  }

  _onImageLoad = (): void => {
    if (!this._mounted) {
      return;
    }
    // This handles the case when `resolvedImage` failed but the image itself
    // still loaded the src. The may happen when the `resolveImage` uses
    // the proxied url and the <img /> uses a non-proxied url.
    const el:any = document.getElementById(`${this._id}-img`);
    if (!el) {
      return;
    }

    const src = el.getAttribute('data-src');
    if (!src) {
      return;
    }

    const {resolvedImage} = this.state;
    if (resolvedImage && resolvedImage.complete) {
      return;
    }

    if (!resolvedImage || (resolvedImage && !resolvedImage.complete)) {
      const {naturalHeight, naturalWidth, width, height} = el;
      this.setState({
        resolvedImage: {
          width: naturalWidth || width,
          height: naturalHeight || height,
          src,
        }
      });
    }
  };

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

  _onChange = (value: ?{align: ?string}): void => {
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

  _onBodyRef = (ref: any): void => {
    if (ref) {
      this._body = ref;
      // Mounting
      const el = ReactDOM.findDOMNode(ref);
      if (el instanceof HTMLElement) {
        ResizeObserver.observe(el, this._onBodyResize);
      }
    } else {
      // Unmounting.
      const el = this._body && ReactDOM.findDOMNode(this._body);
      if (el instanceof HTMLElement) {
        ResizeObserver.unobserve(el);
      }
      this._body = null;
    }
  };

  _onBodyResize = (info: ResizeObserverEntry): void => {
    const maxWidth = this._body ?
      getMaxResizeWidth(ReactDOM.findDOMNode(this._body)) :
      NaN;
    this.setState({
      maxWidth,
    });
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
