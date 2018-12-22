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
    document.addEventListener('focusin', this._onFocusChange, true);
    document.addEventListener('focusout', this._onFocusChange, false);

    this.update(editorView);
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
    view.dom.classList.add(CLASS_NAME_HAS_PLACEHOLDER);

    ReactDOM.render(
      <div>{placeholder}</div>,
      el,
    );
  }

  destroy() {
    this._hide();

    const el = this._el;
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
      ReactDOM.unmountComponentAtNode(el);
    }
    document.removeEventListener('focusin', this._onFocusChange, true);
    document.removeEventListener('focusout', this._onFocusChange, false);
    this._view = null;
    this._el = null;
    this._focused = false;
  }


  _onFocusChange = (e: Event): void => {
    const activeElement = document.activeElement;
    const bodyEl = this._getBodyElement();
    const el = this._el;
    const doc = document;
    const view = this._view;
    if (!view || !el) {
      return;
    }
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
    const el = this._el;
    if (this._focused !== true && el) {
      this._focused = true;
      this._hide();
    }
  }

  _onBlur(): void {
    const el = this._el;
    const view = this._view;
    if (this._focused !== false && el && view ) {
      this._focused = false;
      if (isEditorStateEmpty(view.state)) {
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
    const el = this._el;
    if (el && this._visible !== true) {
      this._visible = true;
      el.style.display = 'block';
      this._view && this.update(this._view);
    }
  }

  _hide(): void {


    const el = this._el;
    if (el && this._visible !== false) {
      this._visible = false;
      el.style.display = 'none';
      const view = this._view;
      view && view.dom.classList.remove(CLASS_NAME_HAS_PLACEHOLDER);
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
