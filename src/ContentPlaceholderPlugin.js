// @flow

import {Plugin} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import React from 'react';
import ReactDOM from 'react-dom';

import isEditorStateEmpty from './isEditorStateEmpty';

import './ui/czi-editor.css';

const CLASS_NAME_HAS_PLACEHOLDER = 'czi-has-placeholder';

class ContentPlaceholderView {
  _el = null;
  _focused = null;
  _view = null;
  _visible = null;

  constructor(editorView: EditorView) {
    const el: any = document.createElement('div');

    this._el = el;
    this._view = editorView;

    el.className = 'czi-editor-content-placeholder';
    editorView.dom.parentNode.appendChild(el);
    document.addEventListener('focusin', this._checkFocus, true);
    document.addEventListener('focusout', this._checkFocus, false);

    this.update(editorView);

    // We don't know whether view is focused at this moment yet. Manually
    // calls `this._checkFocus` which will set `_focused` accordingly.
    this._checkFocus();
  }

  update(view: EditorView): void {
    this._view = view;

    const el = this._el;
    if (!el || !view) {
      return;
    }

    if (this._focused || !isEditorStateEmpty(view.state)) {
      this._hide();
      return;
    }

    const parentEl = el.parentNode;
    const bodyEl = this._getBodyElement();
    const placeholder = view.placeholder;
    if (!parentEl || !bodyEl || !placeholder) {
      return;
    }

    this._visible = true;
    view.dom.classList.add(CLASS_NAME_HAS_PLACEHOLDER);

    const parentElRect = parentEl.getBoundingClientRect();
    const bodyRect = bodyEl.getBoundingClientRect();
    const bodyStyle = window.getComputedStyle(bodyEl);

    const left = bodyRect.left - parentElRect.left;
    const top = bodyRect.top - parentElRect.top;

    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.padding = bodyStyle.padding;
    el.style.display = 'block';
    el.style.width = bodyEl.offsetWidth + 'px';

    ReactDOM.render(
      <div>{placeholder}</div>,
      el,
    );
  }

  destroy() {
    this._hide();

    const el = this._el;
    if (el) {
      el.parentNode && el.parentNode.removeChild(el);
      ReactDOM.unmountComponentAtNode(el);
    }
    document.removeEventListener('focusin', this._checkFocus, true);
    document.removeEventListener('focusout', this._checkFocus, false);
    this._view = null;
    this._el = null;
    this._focused = false;
    this._visible = false;
  }

  _checkFocus = (): void => {
    const el = this._el;
    const view = this._view;
    if (!view || !el) {
      return;
    }
    const doc = document;
    const activeElement = doc.activeElement;
    const bodyEl = this._getBodyElement();

    if (!activeElement || !bodyEl || (doc.hasFocus && !doc.hasFocus())) {
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
    if (this._focused !== true) {
      this._focused = true;
      this._hide();
    }
  }

  _onBlur(): void {
    const view = this._view;
    if (this._focused !== false) {
      this._focused = false;
      if (view && isEditorStateEmpty(view.state)) {
        this._show();
      } else {
        this._hide();
      }
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

  _show(): void {
    if (this._visible !== true) {
      const el = this._el;
      const view = this._view;
      this._visible = true;
      if (el) {
        el.style.display = 'block';
      }
      if (view) {
        this.update(view);
        view.dom.classList.add(CLASS_NAME_HAS_PLACEHOLDER);
      }
    }
  }

  _hide(): void {
    if (this._visible !== false) {
      const el = this._el;
      const view = this._view;
      this._visible = false;
      if (el) {
        el.style.display = 'none';
      }
      if (view) {
        view.dom.classList.remove(CLASS_NAME_HAS_PLACEHOLDER);
      }
    }
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
