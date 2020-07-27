// @flow

import { Fragment, Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { TextSelection } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import {
  hideCursorPlaceholder,
  showCursorPlaceholder,
} from './CursorPlaceholderPlugin';
import { IMAGE } from './NodeNames';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';

import type { ImageLike } from './Types';

function insertImage(tr: Transform, schema: Schema, src: ?string): Transform {
  const { selection } = tr;
  if (!selection) {
    return tr;
  }
  const { from, to } = selection;
  if (from !== to) {
    return tr;
  }

  const image = schema.nodes[IMAGE];
  if (!image) {
    return tr;
  }

  const attrs = {
    src: src || '',
    alt: '',
    title: '',
  };

  const node = image.create(attrs, null, null);
  const frag = Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

class ImageSourceCommand extends UICommand {
  _popUp = null;

  getEditor(): Class<React.Component<any, any>> {
    throw new Error('Not implemented');
  }

  isEnabled = (state: EditorState, view: ?EditorView): boolean => {
    return this.__isEnabled(state, view);
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent<>
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(undefined);
    }

    if (dispatch) {
      dispatch(showCursorPlaceholder(state));
    }

    return new Promise(resolve => {
      const props = { runtime: view ? view.runtime : null };
      this._popUp = createPopUp(this.getEditor(), props, {
        modal: true,
        onClose: val => {
          if (this._popUp) {
            this._popUp = null;
            resolve(val);
          }
        },
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    inputs: ?ImageLike
  ): boolean => {
    if (dispatch) {
      const { selection, schema } = state;
      let { tr } = state;
      tr = view ? hideCursorPlaceholder(view.state) : tr;
      tr = tr.setSelection(selection);
      if (inputs) {
        const { src } = inputs;
        tr = insertImage(tr, schema, src);
      }
      dispatch(tr);
      view && view.focus();
    }

    return false;
  };

  __isEnabled = (state: EditorState, view: ?EditorView): boolean => {
    const tr = state;
    const { selection } = tr;
    if (selection instanceof TextSelection) {
      return selection.from === selection.to;
    }
    return false;
  };
}

export default ImageSourceCommand;
