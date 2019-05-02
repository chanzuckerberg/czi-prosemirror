// @flow

import './czi-math-view.css';
import CustomNodeView from './CustomNodeView';
import MathInlineEditor from './MathInlineEditor';
import React from 'react';
import createPopUp from './createPopUp';
import cx from 'classnames';
import renderLaTeXAsHTML from './renderLaTeXAsHTML';
import uuid from './uuid';
import {Decoration} from 'prosemirror-view';
import {FRAMESET_BODY_CLASSNAME} from './EditorFrameset';
import {Node} from 'prosemirror-model';
import {atAnchorBottomCenter} from './PopUpPosition';

import type {NodeViewProps} from './CustomNodeView';

const EMPTY_SRC =
  'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class MathViewBody extends React.PureComponent<any, any, any> {
  props: NodeViewProps;

  state = {
    isEditing: false,
  };

  _inlineEditor = null;
  _id = uuid();
  _mounted = false;

  componentDidMount(): void {
    this._mounted = true;
    this._renderInlineEditor();
  }

  componentWillUnmount(): void {
    this._mounted = false;
  }

  componentDidUpdate(prevProps: NodeViewProps): void {
    this._renderInlineEditor();
  }

  render(): React.Element<any> {
    // TODO: Resolve `readOnly`;
    const readOnly = false;
    const {node, selected, focused} = this.props;
    const {attrs} = node;
    const {latex} = attrs;
    const {isEditing} = this.state;

    const active = (focused || isEditing) && !readOnly;
    const className = cx('czi-math-view-body', {active, selected});
    const html = renderLaTeXAsHTML(latex);
    return (
      <span
        className={className}
        data-active={active ? 'true' : null}
        data-latex={latex || ''}
        id={this._id}
        title={latex}
      >
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
      onEditStart: this._onEditStart,
      onEditEnd: this._onEditEnd,
    };
    if (this._inlineEditor) {
      this._inlineEditor.update(editorProps);
    } else {
      this._inlineEditor = createPopUp(MathInlineEditor, editorProps, {
        anchor: el,
        autoDismiss: false,
        container: el.closest(`.${FRAMESET_BODY_CLASSNAME}`),
        position: atAnchorBottomCenter,
        onClose: () => {
          this._inlineEditor = null;
        },
      });
    }
  }

  _onEditStart = (): void => {
    this.setState({isEditing: true});
  };

  _onEditEnd = (): void => {
    this.setState({isEditing: false});
  };

  _onChange = (value: ?{align: ?string, latex: string}): void => {
    if (!this._mounted) {
      return;
    }

    const align = value ? value.align : null;
    const latex = value ? value.latex : null;

    const {getPos, node, editorView} = this.props;
    const pos = getPos();
    const attrs = {
      ...node.attrs,
      latex,
      align,
    };

    let tr = editorView.state.tr;
    const {selection} = editorView.state;
    tr = tr.setNodeMarkup(pos, null, attrs);
    tr = tr.setSelection(selection);
    editorView.dispatch(tr);
  };
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
