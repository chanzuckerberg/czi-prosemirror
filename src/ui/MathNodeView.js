// @flow

import './czi-math-view.css';
import CustomNodeView from './CustomNodeView';
import React from 'react';
import cx from 'classnames';
import nullthrows from 'nullthrows';
import renderLaTeXAsHTML from './renderLaTeXAsHTML';
import uuid from './uuid';
import {EditorView, Decoration} from "prosemirror-view";
import {Node} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';

import type {EditorRuntime} from '../Types';
import type {NodeViewProps} from './CustomNodeView';

const EMPTY_SRC = 'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class MathViewBody extends React.PureComponent<any, any, any> {

  props: NodeViewProps;

  _alignEditor = null;
  _id = uuid();
  _mounted = false;

  componentDidMount(): void {
    this._mounted = true;
    this._renderAlignEditor();
  }

  componentWillUnmount(): void {
    this._mounted = false;
  }

  componentDidUpdate(prevProps: NodeViewProps): void {
    this._renderAlignEditor();
  }

  render(): React.Element<any> {
    // TODO: Resolve `readOnly`;
    const readOnly = false;
    const {node, selected} = this.props;
    const {attrs} = node;
    const {latex} = attrs;

    const active = selected && !readOnly;
    const className = cx('czi-math-view-body', {active});
    const html = renderLaTeXAsHTML(latex);
    return (
      <span
        className={className}
        data-active={active ? 'true' : null}
        data-latex={latex || ''}
        id={this._id}
        title={latex}>
        <img
          alt={latex}
          className="czi-math-view-body-img"
          src={EMPTY_SRC}
          title={latex}
        />
        <span
          className="czi-math-view-body-content"
          dangerouslySetInnerHTML={{__html: html}}
        />
      </span>
    );
  }

  _renderAlignEditor(): void {
    // TODO
  }
}

class MathNodeView extends CustomNodeView {

  // @override
  createDOMElement(): HTMLElement {
    const el = document.createElement('span');
    el.className = 'czi-math-view';
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
    return <MathViewBody {...this.props} />;
  }

  _updateDOM(el: HTMLElement): void {
    const {align} = this.props.node.attrs;
    let className = 'czi-math-view';
    if (align) {
      className += ' align-' + align;
    }
    el.className = className;
  }
}

export default MathNodeView;
