// @flow

import {Node} from 'prosemirror-model';
import {Decoration} from 'prosemirror-view';
import React from 'react';

import {
  DOM_ATTRIBUTE_PAGE_BREAK,
} from './../PageBreakNodeSpec';

import CustomNodeView from './CustomNodeView';

import './czi-pagebreak-view.css';

import type {NodeViewProps} from './CustomNodeView';

class PageBreakView extends React.PureComponent<any, any, any> {
  props: NodeViewProps;

  render(): React.Element<any> {
    return (
      <div className="pagebreak-container">
        <hr className="pagebreak-hr" />
        <p className="pagebreak-description">
          This is a manually inserted page break. This text will not appear when
          the page is printed.
        </p>
        <hr className="pagebreak-hr" />
      </div>
    );
  }
}

class PageBreakNodeView extends CustomNodeView {
  // @override
  createDOMElement(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'czi-pagebreak-view';
    el.setAttribute(DOM_ATTRIBUTE_PAGE_BREAK, 'true')
    return el;
  }

  // @override
  update(node: Node, decorations: Array<Decoration>): boolean {
    super.update(node, decorations);
    return true;
  }

  // @override
  renderReactComponent(): React.Element<any> {
    return <PageBreakView {...this.props} />;
  }
}

export default PageBreakNodeView;
