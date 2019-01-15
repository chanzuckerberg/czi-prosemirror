// @flow

import cx from 'classnames';
import {Node} from 'prosemirror-model';
import {Decoration} from 'prosemirror-view';
import React from 'react';
import ReactDOM from 'react-dom';

import CustomNodeView from './CustomNodeView';
import ImageInlineEditor from './ImageInlineEditor';
import ImageResizeBox from './ImageResizeBox';
import {MIN_SIZE} from './ImageResizeBox';
import {atAnchorBottomCenter} from './PopUpPosition';
import ResizeObserver from './ResizeObserver';
import createPopUp from './createPopUp';
import resolveImage from './resolveImage';
import uuid from './uuid';

import './czi-image-view.css';

import type {EditorRuntime} from '../Types';
import type {NodeViewProps} from './CustomNodeView';
import type {ResizeObserverEntry} from './ResizeObserver';

const EMPTY_SRC = 'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/* This value must be synced with the margin defined at .czi-image-view */
const IMAGE_MARGIN = 2;

const MAX_SIZE = 100000;

const DEFAULT_ORIGINAL_SIZE = {
  src: '',
  complete: false,
  height: 0,
  width: 0,
};

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
    const {offsetParent} = node;
    const style = el.ownerDocument.defaultView.getComputedStyle(offsetParent);
    let width = offsetParent.clientWidth - IMAGE_MARGIN * 2;
    if (style.boxSizing === 'border-box') {
      const pl = parseInt(style.paddingLeft, 10);
      const pr = parseInt(style.paddingRight, 10);
      width -= (pl + pr);
    }
    return Math.max(width, MIN_SIZE);
  }
  // Let the image resize freely.
  return MAX_SIZE;
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
    maxSize: {
      width: MAX_SIZE,
      height: MAX_SIZE,
      complete: false,
    },
    originalSize: DEFAULT_ORIGINAL_SIZE,
  };

  componentDidMount(): void {
    this._mounted = true;
    this._resolveOriginalSize();
    this._renderInlineEditor();
  }

  componentWillUnmount(): void {
    this._mounted = false;
    this._inlineEditor && this._inlineEditor.close();
    this._inlineEditor = null;
  }

  componentDidUpdate(prevProps: NodeViewProps): void {
    const prevSrc = prevProps.node.attrs.src;
    const {node} = this.props;
    const {src} = node.attrs;
    if (prevSrc !== src) {
      // A new image is provided, resolve it.
      this._resolveOriginalSize();
    }
    this._renderInlineEditor();
  }

  render(): React.Element<any> {
    const {originalSize, maxSize} = this.state;
    const {editorView, node, selected, focused} = this.props;
    const {readOnly} = editorView;
    const {attrs} = node;
    const {align, crop} = attrs;

    // It's only active when the image's fully loaded.
    const loading = !originalSize.complete && !originalSize.src;
    const active = focused && !readOnly && originalSize.complete;
    const src =  originalSize.complete ? originalSize.src : EMPTY_SRC;
    const aspectRatio = originalSize.width / originalSize.height;

    let {width, height} = attrs;
    if (width && !height) {
      height = width / aspectRatio;
    } else if (height && !width) {
      width = height * aspectRatio;
    } else if (!width && !height) {
      width = originalSize.width;
      height =  originalSize.height;
    }

    let scale = 1;
    if (width > maxSize.width) {
      // Scale image to fit its containing space.
      // If the image is not cropped.
      width = maxSize.width;
      height = width / aspectRatio;
      scale =  maxSize.width / width;
    }

    const className = cx('czi-image-view-body', {
      active,
      error: originalSize.src && !originalSize.complete,
      focused,
      loading,
      selected,
    });

    const resizeBox = active ?
      <ImageResizeBox
        height={height}
        onResizeEnd={this._onResizeEnd}
        src={src}
        width={width}
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
      const cropped = {...crop};
      if (scale !== 1) {
        scale = maxSize.width / cropped.width;
        cropped.width *= scale;
        cropped.height *= scale;
        cropped.left *= scale;
        cropped.top *= scale;
      }
      clipStyle.width = cropped.width + 'px';
      clipStyle.height = cropped.height + 'px';
      imageStyle.left = cropped.left + 'px';
      imageStyle.top = cropped.top + 'px';
    }


    return (
      <span
        className={className}
        data-active={active ? 'true' : undefined}
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
              src={src}
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

  _resolveOriginalSize = async (): Promise<void> => {
    if (!this._mounted) {
      // unmounted;
      return;
    }

    this.setState({originalSize: DEFAULT_ORIGINAL_SIZE});
    const src = this.props.node.attrs.src;
    const url = resolveURL(
      this.props.editorView.runtime,
      src,
    );
    const originalSize = await resolveImage(url);
    if (!this._mounted) {
      // unmounted;
      return;
    }
    if (this.props.node.attrs.src !== src) {
      // src had changed.
      return;
    }

    if (!originalSize.complete) {
      originalSize.width = MIN_SIZE;
      originalSize.height = MIN_SIZE;
    }
    this.setState({originalSize});
  };

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
    const width = this._body ?
      getMaxResizeWidth(ReactDOM.findDOMNode(this._body)) :
      MAX_SIZE;

    console.log('max-width', width);

    this.setState({
      maxSize: {
        width,
        height: MAX_SIZE,
        complete: !!this._body,
      },
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
