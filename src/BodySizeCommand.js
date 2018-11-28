// @flow

import BodySizeEditor from './ui/BodySizeEditor';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {BODY} from './NodeNames';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Fragment, Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {atViewportCenter} from './ui/PopUpPosition';
import {showCursorPlaceholder, hideCursorPlaceholder} from './CursorPlaceholderPlugin';

import type {BodySizeEditorValue} from './ui/BodySizeEditor';


class PageSizeCommand extends UICommand {

  _popUp = null;

  isEnabled = (state: EditorState): boolean => {
    const {doc} = state;
    const node = doc.firstChild;
    if (node && node.type && node.type.name === BODY) {
      return true;
    }
    return false;
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent,
  ): Promise<any> => {
    const {doc} = state;
    const node = doc.firstChild;

    if (!node || !node.type || node.type.name !== BODY) {
      return Promise.resolve(undefined);
    }

    if (this._popUp) {
      return Promise.resolve(undefined);
    }

    if (dispatch) {
      dispatch(showCursorPlaceholder(state));
    }

    return new Promise(resolve => {
      const props = {
        initialValue: node.attrs,
      };
      this._popUp = createPopUp(BodySizeEditor, props, {
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
    inputs: ?BodySizeEditorValue,
  ): boolean => {
    if (dispatch) {
      let {tr, selection, schema} = state;
      tr = view ? hideCursorPlaceholder(view.state) : tr;
      tr = tr.setSelection(selection);
      console.log('>>>>>>>>.', inputs);
      if (inputs) {
        // console.log(inputs);
      }
      dispatch(tr);
      view && view.focus();
    }

    return false;
  };
}


export default PageSizeCommand;
