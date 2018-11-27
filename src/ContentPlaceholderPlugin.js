// @flow

import './ui/czi-editor.css';
import React from 'react';
import ReactDOM from 'react-dom';
import isEditorStateEmpty from './isEditorStateEmpty';
import {EditorState, Plugin} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

class ContentPlaceholderView {
  _el = null;
  _view = null;

  constructor(editorView: EditorView) {
    const el: any = document.createElement('div');
    el.addEventListener('mousedown', this._onMouseDown, true);
    this._el = el;

    el.className = 'czi-editor-content-placeholder';
    editorView.dom.parentNode.appendChild(el);

    this.update(editorView, null);
  }

  update(view: EditorView, lastState: EditorState): void {
    this._view = view;

    const el = this._el;
    if (!el) {
      return;
    }

    console.log(111, view.focused, view);

    if (!isEditorStateEmpty(view.state) || view.focused) {
      el.style.display = 'none';
      return;
    }

    const parentEl = el.parentNode;
    const bodyEl = view.docView.dom.firstChild;
    if (!parentEl || !bodyEl) {
      el.style.display = 'none';
      return;
    }

    const parentElRect = parentEl.getBoundingClientRect();
    const bodyRect = bodyEl.getBoundingClientRect();
    const bodyStyle = window.getComputedStyle(bodyEl);

    const left = bodyRect.left - parentElRect.left;
    const top = bodyRect.top - parentElRect.top;

    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.padding = bodyStyle.padding;
    el.style.display = 'block';

    const placeholder = view.placeholder || 'Type Something';

    ReactDOM.render(
      <div>{placeholder}</div>,
      el,
    );

    console.log(el);
  }

  destroy() {
    this._view = null;
    const el = this._el;
    if (el && el.parentNode) {
      el.removeEventListener('mousedown', this._onMouseDown, true);
      el.parentNode.removeChild(el);
      ReactDOM.unmountComponentAtNode(el);
    }
  }

  _onMouseDown = (e: Event): void => {
    e.preventDefault();
    const el: ?HTMLElement = this._el;
    if (el) {
      el.style.display = 'none';
    }
    setTimeout(this._focus, 350);
  };

  _focus = (): void => {
    const view: ?EditorView = this._view;
    if (!view || view.focused) {
      return;
    }

    view.focus();
    // view.docView.nodeDOM.focus();
    // view.focus();
  };
}

class ContentPlaceholderPlugin extends Plugin {
  constructor() {
    super({
      view(editorView: EditorView) {
        return new ContentPlaceholderView(editorView);
      }
    });
  };
}

export default ContentPlaceholderPlugin;
