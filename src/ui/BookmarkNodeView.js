// @flow

import {Node} from 'prosemirror-model';
import {Decoration} from 'prosemirror-view';
import * as React from 'react';

import {
  ATTRIBUTE_BOOKMARK_ID,
  ATTRIBUTE_BOOKMARK_VISIBLE,
} from './../BookmarkNodeSpec';
import CustomNodeView from './CustomNodeView';
import Icon from './Icon';

import './czi-bookmark-view.css';

import type {NodeViewProps} from './CustomNodeView';

class BookmarkViewBody extends React.PureComponent<any, any> {
  props: NodeViewProps;

  render(): React.Element<any> {
    const {id, visible} = this.props.node.attrs;
    const icon = id && visible ? Icon.get('bookmark') : null;
    return <span onClick={this._onClick}>{icon}</span>;
  }

  _onClick = (e: SyntheticEvent<>): void => {
    e.preventDefault();
    const {id} = this.props.node.attrs;
    const hash = '#' + id;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  };
}

class BookmarkNodeView extends CustomNodeView {
  // @override
  createDOMElement(): HTMLElement {
    const el = document.createElement('a');
    el.className = 'czi-bookmark-view';
    this._updateDOM(el);
    return el;
  }

  // @override
  update(node: Node, decorations: Array<Decoration>): boolean {
    super.update(node, decorations);
    return true;
  }

  // @override
  renderReactComponent(): React.Element<any> {
    return <BookmarkViewBody {...this.props} />;
  }

  _updateDOM(el: HTMLElement): void {
    const {id, visible} = this.props.node.attrs;
    el.setAttribute('id', id);
    el.setAttribute('title', id);
    el.setAttribute(ATTRIBUTE_BOOKMARK_ID, id);
    visible && el.setAttribute(ATTRIBUTE_BOOKMARK_VISIBLE, 'true');
  }
}

export default BookmarkNodeView;
