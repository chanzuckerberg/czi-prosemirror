// @flow

import CustomNodeView from './CustomNodeView';
import React from 'react';
import cx from 'classnames';
import {EditorView} from "prosemirror-view";
import {Node} from 'prosemirror-model';

import type {NodeViewProps} from './CustomNodeView';

import './czi-prose-mirror.css';
import './czi-image-view.css';

class ImageComponent extends React.PureComponent<any, any, any> {

  props: NodeViewProps;

  _unmounted = false;

  render(): React.Element<any> {
    const {node} = this.props;
    const src = node.attrs.src;
    return (
      <span className="czi-image-view-body">
        <img src={src} />
      </span>
    );
  }

  componentWillUnmount(): void {
    this._unmounted = true;
  }
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
    return <ImageComponent {...this.props} />;
  }
}

export default ImageNodeView;
