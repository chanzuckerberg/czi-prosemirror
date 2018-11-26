// @flow

import './ui/czi-pop-up.css';
import LinkTooltip from './ui/LinkTooltip';
import LinkURLEditor from './ui/LinkURLEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import findNodesWithSameMark from './findNodesWithSameMark';
import uuid from './ui/uuid';
import {EditorState, Plugin} from 'prosemirror-state';
import {EditorView, Decoration, DecorationSet} from "prosemirror-view";
import {MARK_LINK} from './MarkNames';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {showSelectionPlaceholder, hideSelectionPlaceholder} from './SelectionPlaceholderPlugin';

// https://prosemirror.net/examples/tooltip/
const SPEC = {
  view(editorView: EditorView) {
    return new LinkTooltipView(editorView);
  }
};

class LinkTooltipPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

class LinkTooltipView {
  _el = null;
  _popUp = null;

  constructor(editorView: EditorView) {
    const el: any = document.createElement('div');
    this._el = el;

    el.className = 'czi-pop-up-element';

    editorView.dom.parentNode.appendChild(el);

    this.update(editorView, null);
  }

  update(view: EditorView, lastState: EditorState): void {

    const el = this._el;
    if (!el) {
      return;
    }

    const {state} = view;
    const {doc, selection, schema, storedMarks} = state;
    const markType = schema.marks[MARK_LINK];
    if (!markType) {
      return;
    }
    const {from, to} = selection;
    const result = findNodesWithSameMark(doc, from, to, markType);

    if (!result) {
      el.parentNode && el.parentNode.removeChild(el);
      ReactDOM.unmountComponentAtNode(el);
      return;
    }

    // These are in screen coordinates
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    // The box in which the tooltip is positioned, to use as base
    // const box = el.offsetParent.getBoundingClientRect();
    // Find a center-ish x position from the selection endpoints (when
    // crossing lines, end may be more to the left)
    const left = Math.max((start.left + end.left) / 2, start.left + 3);
    el.style.left = left + 'px';
    el.style.top = start.top + 'px';

    const {body} = document;
    if (!el.parentNode && body) {
      body.appendChild(el);
    }

    ReactDOM.render(
      <LinkTooltip
        editorView={view}
        href={result.mark.attrs.href}
        onEdit={this._onEdit}
        onRemove={this._onRemove}
      />,
      el,
    );
  }

  destroy() {
    const el = this._el;
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
      ReactDOM.unmountComponentAtNode(el);
    }
    this._popUp && this._popUp.close();
  }

  _onEdit = (view: EditorView): void => {
    if (this._popUp) {
      return;
    }

    const {state} = view;
    const {schema, doc, selection} = state;
    const {from, to} = selection;
    const markType = schema.marks[MARK_LINK];
    const result = findNodesWithSameMark(
      doc,
      from,
      to,
      markType,
    );
    if (!result) {
      return;
    }
    let {tr} = state;
    const linkSelection = TextSelection.create(
      tr.doc,
      result.from.pos,
      result.to.pos + 1,
    );

    tr = tr.setSelection(linkSelection);
    tr = showSelectionPlaceholder(state, tr);
    view.dispatch(tr);

    const href = result ? result.mark.attrs.href : null;
    this._popUp = createPopUp(LinkURLEditor,  {href}, {
      onClose: (value) => {
        this._popUp = null;
        this._onEditEnd(view, selection, value);
      },
    });
  }

  _onRemove = (view: EditorView): void => {
    this._onEditEnd(view, view.state.selection, null);
  };

  _onEditEnd = (
    view: EditorView,
    initialSelection: TextSelection,
    href: ?string,
  ): void => {
    const {state, dispatch} = view;
    let tr = hideSelectionPlaceholder(state);

    if (href !== undefined) {
      const {schema} = state;
      const markType = schema.marks[MARK_LINK];
      if (markType) {
        const result = findNodesWithSameMark(
          tr.doc,
          initialSelection.from,
          initialSelection.to,
          markType,
        );
        if (result) {
          const linkSelection = TextSelection.create(
            tr.doc,
            result.from.pos,
            result.to.pos + 1,
          );
          tr = tr.setSelection(linkSelection);
          const attrs = href ? {href} : null;
          tr = applyMark(
            tr,
            schema,
            markType,
            attrs,
          );
        }
      }
    }
    tr = tr.setSelection(initialSelection);
    dispatch(tr);
    view.focus();
  };
}

export default LinkTooltipPlugin;
