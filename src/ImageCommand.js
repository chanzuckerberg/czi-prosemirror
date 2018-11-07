// @flow

import ImageEditor from './ui/ImageEditor';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Fragment, Schema} from 'prosemirror-model';
import {IMAGE} from './NodeNames';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

import type {ImageEditorValue} from './ui/ImageEditor';

function insertImage(
  tr: Transform,
  schema: Schema,
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

  const prevNode = tr.doc.nodeAt(from);
  const node = image.create({}, null, null);
  const frag = Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

class ImageCommand extends UICommand {

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
    event: ?SyntheticEvent,
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(null);
    }
    const target = nullthrows(event).currentTarget;
    if (!(target instanceof HTMLElement)) {
      return Promise.resolve(null);
    }

    const anchor = event ? event.currentTarget : null;
    return new Promise(resolve => {
      this._popUp = createPopUp(ImageEditor, null, {
        anchor,
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
    inputs: ?ImageEditorValue,
  ): boolean => {
    if (dispatch) {
      let {tr, selection} = state;
      if (inputs) {
        const {width, height, src} = inputs;
        tr = tr.setSelection(selection);
        console.log(inputs);
        // tr = insertImage(tr, this._schema, rows, cols);
      }
      dispatch(tr);
    }
    return false;
  };
}


export default ImageCommand;
