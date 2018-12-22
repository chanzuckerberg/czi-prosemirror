// @flow

import {Node} from 'prosemirror-model';
import {Decoration} from 'prosemirror-view';
import React from 'react';

import {ATTRIBUTE_BOOKMARK_ID} from './../BookmarkNodeSpec';
import CustomNodeView from './CustomNodeView';
import Icon from './Icon';

import './czi-bookmark-view.css';

import type {NodeViewProps} from './CustomNodeView';

class BookmarkViewBody extends React.PureComponent<any, any, any> {

  props: NodeViewProps;

  render(): React.Element<any> {
    return <span onClick={this._onClick}>{Icon.get('bookmark')}</span>;
  }

  _onClick = (e: SyntheticEvent): void => {
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
    const {id} = this.props.node.attrs;
    el.setAttribute('id', id);
    el.setAttribute('title', id);
    el.setAttribute(ATTRIBUTE_BOOKMARK_ID, id);
  }
}

export default BookmarkNodeView;