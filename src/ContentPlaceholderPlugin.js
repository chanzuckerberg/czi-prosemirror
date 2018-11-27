// @flow

import './ui/czi-editor.css';
import React from 'react';
import ReactDOM from 'react-dom';
import isEditorStateEmpty from './isEditorStateEmpty';
import {EditorState, Plugin} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

class ContentPlaceholderView {
  _el = null;
  _focused = false;
  _view = null;

  constructor(editorView: EditorView) {
    const el: any = document.createElement('div');

    this._el = el;
    this._view = editorView;

    el.className = 'czi-editor-content-placeholder';
    editorView.dom.parentNode.appendChild(el);
    document.addEventListener('focusin', this._onFocusIn, true);

    this.update(editorView, null);
  }

  update(view: EditorView, lastState: EditorState): void {
    this._view = view;

    const el = this._el;
    if (!el) {
      return;
    }

    if (this._focused || !isEditorStateEmpty(view.state)) {
      return;
    }

    const parentEl = el.parentNode;
    const bodyEl = this._getBodyElement();
    if (!parentEl || !bodyEl) {
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
  }

  destroy() {
    const el = this._el;
    if (el && el.parentNode) {
      // el.removeEventListener('mousedown', this._onMouseDown, true);
      el.parentNode.removeChild(el);
      ReactDOM.unmountComponentAtNode(el);
    }
    document.removeEventListener('focusin', this._onFocusIn, true);
    this._view = null;
    this._el = null;
    this._focused = false;
  }


  _onFocusIn = (e: Event): void => {
    console.log(e);

    const activeElement = document.activeElement;
    const bodyEl = this._getBodyElement();
    const el = this._el;
    const view = this._view;
    if (!view || !el) {
      console.log(111);
      return;
    }
    if (!activeElement || !bodyEl) {
      console.log(activeElement, bodyEl);
      this._onBlur();
    } else {
      if (
        activeElement === bodyEl ||
        bodyEl.contains(activeElement) ||
        activeElement === bodyEl.parentNode
      ) {
        this._onFocus();
      } else {
        this._onBlur();
      }
    }
  };

  _onFocus(): void {
    const el = this._el;
    if (!this._focused && el) {
      console.log('_focused')
      this._focused = true;
      el.style.display = 'none';
    }
  }

  _onBlur(): void {
    const el = this._el;
    if (this._focused && el) {
      console.log('!!_focused')
      this._focused = false;
      el.style.display = 'block';
    }
  }

  _getBodyElement(): ?HTMLElement {
    const view = this._view;
    return (
      view &&
      view.docView &&
      view.docView.dom &&
      view.docView.dom.firstChild
    );
  }
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
