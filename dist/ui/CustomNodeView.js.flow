// @xflow

import React from 'react';
import ReactDOM from 'react-dom';
import {EditorView, Decoration} from "prosemirror-view";
import {Node} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

export type NodeViewProps = {
  editorView: EditorView,
  getPos: () => number,
  node: Node,
  selected: boolean,
  focused: boolean,
};

// Standard className for selected node.
const SELECTED_NODE_CLASS_NAME = 'ProseMirror-selectednode';

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
      view.__renderReactComponent();
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
class CustomNodeView {

  dom: HTMLElement;

  props: NodeViewProps;

  constructor(
    node: Node,
    editorView: EditorView,
    getPos: () => number,
    decorations: Array<Decoration>,
  ) {

    this.props = {
      decorations,
      editorView,
      getPos,
      node,
      selected: false,
      focused: false,
    };

    pendingViews.add(this);

    // The editor will use this as the node's DOM representation
    const dom = this.createDOMElement();
    this.dom = dom;

    if (pendingViews.size === 1) {
      mutationObserver.observe(document, {childList: true, subtree: true});
    }
  }

  update(node: Node, decorations: Array<Decoration>): boolean {
    console.log('update');
    this.props = {
      ...this.props,
      node,
    };
    this.__renderReactComponent();
    return true;
  }

  stopEvent(): boolean {
    return false;
  }

  // Mark this node as being the selected node.
  selectNode() {
    this.dom.classList.add(SELECTED_NODE_CLASS_NAME);
    this.__renderReactComponent();
  }

  // Remove selected node marking from this node.
  deselectNode() {
    this.dom.classList.remove(SELECTED_NODE_CLASS_NAME);
    this.__renderReactComponent();
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

  __renderReactComponent(): void {
    const {editorView, getPos} = this.props;
    if (editorView.state && editorView.state.selection) {
      const {from, to} = editorView.state.selection;
      const pos = getPos();
      const selected = pos >= pos && pos <= to;
      const focused = pos === from;
      if (selected !== this.props.selected || focused !== this.props.focused) {
        this.props = {
          ...this.props,
          selected,
          focused,
        };
      }
    }

    // const {selected, focused} = this.props;
    // console.log({selected, focused});

    ReactDOM.render(this.renderReactComponent(), this.dom);
  }
}

export default CustomNodeView;
