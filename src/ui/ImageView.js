// @flow

import React from 'react';
import cx from 'classnames';
import {EditorView} from "prosemirror-view";
import {Node} from 'prosemirror-model';

import './czi-prose-mirror.css';
import './czi-image-view.css';

class ImageView extends React.PureComponent<any, any, any> {

  props: {
    node: Node,
    editorView: EditorView,
    getPos: () => number,
  };

  _unmounted = false;

  render(): React.Element<any> {
    const {node, editorView, getPos} = this.props;
    const src = node.attrs.src;
    return (
      <span className="czi-image-view">
        <img src={src} />
      </span>
    );
  }

  componentWillUnmount(): void {
    this._unmounted = true;
  }
}

export default ImageView;
