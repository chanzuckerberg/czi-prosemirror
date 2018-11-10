// @flow

import CursorPlaceholderPlugin from './CursorPlaceholderPlugin';
import ImageURLEditor from './ui/ImageURLEditor';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Fragment, Schema} from 'prosemirror-model';
import {IMAGE} from './NodeNames';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {atViewportCenter} from './ui/popUpPosition';
import {showCursorPlaceholder, hideCursorPlaceholder} from './CursorPlaceholderPlugin';

import type {ImageURLEditorValue} from './ui/ImageURLEditor';

function insertImage(
  tr: Transform,
  schema: Schema,
  src: ?string,
): Transform {
  const {selection, doc} = tr;
  if (!selection) {
    return tr;
  }
  const {from, to} = selection;
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

  const prevNode = tr.doc.nodeAt(from);
  const node = image.create(attrs, null, null);
  const frag = Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

class ImageFromURLCommand extends UICommand {

  _schema: Schema;
  _popUp = null;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();
    this._schema = schema;
  }

  isEnabled = (state: EditorState): boolean => {
    const tr = state;
    const {selection} = state.tr;
    if (selection instanceof TextSelection) {
      return selection.from === selection.to;
    }
    return false;
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent,
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(null);
    }

    if (dispatch) {
      dispatch(showCursorPlaceholder(state));
    }

    return new Promise(resolve => {
      this._popUp = createPopUp(ImageURLEditor, null, {
        modal: true,
        onClose: (val) => {
          if (this._popUp) {
            this._popUp = null;
            resolve(val);
          }
        }
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    inputs: ?ImageURLEditorValue,
  ): boolean => {
    if (dispatch) {
      let {tr, selection} = state;
      tr = view ? hideCursorPlaceholder(view.state) : tr;
      tr = tr.setSelection(selection);
      if (inputs) {
        const {width, height, src} = inputs;
        tr = insertImage(tr, this._schema, src);
      }
      dispatch(tr);
      view && view.focus();
    }

    return false;
  };
}


export default ImageFromURLCommand;
