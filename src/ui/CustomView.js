// @xflow

import ImageView from './ImageView';
import React from 'react';
import ReactDOM from 'react-dom';
import {EditorView} from "prosemirror-view";
import {Node} from 'prosemirror-model';

import './czi-custom-view.css';

const mountedElements = new Map();
const pendingElements = new Map();

function onMutation(mutations): void {
  const root = document.body;
  if (!root) {
    return;
  }
  for (const [el, bag] of pendingElements) {
    if (root.contains(el)) {
      pendingElements.delete(el);
      const {Component, node, editorView, getPos} = bag;
      ReactDOM.render(
        <Component
          editorView={editorView}
          getPos={getPos}
          node={node}
        />,
        el,
      );
    }
  }
  for (const [el, bag] of mountedElements) {
    if (!root.contains(el)) {
      mountedElements.delete(el);
      ReactDOM.unmountComponentAtNode(el);
    }
  }

  if (mountedElements.size === 0) {
    observer.disconnect();
  }
}

const observer = new MutationObserver(onMutation);

// https://prosemirror.net/docs/guide/
class CustomView {
  constructor(
    node: Node,
    editorView: EditorView,
    getPos: () => number,
    Component: Function,
) {

    // The editor will use this as the node's DOM representation
    const dom = document.createElement('div');
    dom.className = 'czi-custom-view';

    pendingElements.set(dom, {
      node,
      editorView,
      getPos,
      Component,
    });

    this.dom = dom;

    if (pendingElements.size === 1) {
      observer.observe(document, {childList: true, subtree: true});
    }
  }

  stopEvent(): boolean {
    return false;
  }
}

export default CustomView;
