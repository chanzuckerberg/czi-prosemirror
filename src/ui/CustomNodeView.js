// @xflow

import React from 'react';
import ReactDOM from 'react-dom';
import {EditorView} from "prosemirror-view";
import {Node} from 'prosemirror-model';

export type NodeViewProps = {
  node: Node,
  editorView: EditorView,
  getPos: () => number,
};

const mountedViews = new Set();
const pendingViews = new Set();

function onMutation(mutations, observer): void {
  const root = document.body;
  if (!root) {
    return;
  }

  const mountingViews = [];
  for (const view of pendingViews) {
    const el = view.dom;
    if (root.contains(el)) {
      pendingViews.delete(view);
      mountingViews.push(view);
      view.mountReactComponent();
    }
  }

  for (const view of mountedViews) {
    const el = view.dom;
    if (!root.contains(el)) {
      mountedViews.delete(el);
      ReactDOM.unmountComponentAtNode(el);
    }
  }

  mountingViews.forEach(view => mountedViews.add(view));

  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}

const mutationObserver = new MutationObserver(onMutation);

// This implements the `NodeView` interface and renders a Node with a react
// Component.
// https://prosemirror.net/docs/ref/#view.NodeView
// https://github.com/ProseMirror/prosemirror-view/blob/master/src/viewdesc.js#L429
// https://github.com/ProseMirror/prosemirror-view/blob/master/src/viewdesc.js#L429
class CustomNodeView {

  dom: HTMLElement;

  props: NodeViewProps;

  constructor(
    node: Node,
    editorView: EditorView,
    getPos: () => number,
  ) {
    // The editor will use this as the node's DOM representation
    const dom = this.createDOMElement();
    this.dom = dom;

    this.props = {
      node,
      editorView,
      getPos,
    };

    pendingViews.add(this);

    if (pendingViews.size === 1) {
      mutationObserver.observe(document, {childList: true, subtree: true});
    }
  }

  stopEvent(): boolean {
    return false;
  }

  mountReactComponent(): void {
    ReactDOM.render(this.renderReactComponent(), this.dom);
  }

  // This should be overwrite by subclass.
  createDOMElement(): HTMLElement {
    // The editor will use this as the node's DOM representation.
    // return document.createElement('span');
    throw new Error('not implemented');
  }

  // This should be overwrite by subclass.
  renderReactComponent(): React.Element<any> {
    // return <CustomNodeViewComponent {...this.props} />;
    throw new Error('not implemented');
  }
}

export default CustomNodeView;
