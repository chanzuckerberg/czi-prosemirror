// @flow

import {Schema} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import SetDocAttrStep from './SetDocAttrStep';
import DocLayoutEditor from './ui/DocLayoutEditor';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';

import type {DocLayoutEditorValue} from './ui/DocLayoutEditor';

function setDocLayout(
  tr: Transform,
  schema: Schema,
  width: ?number,
  layout: ?string
): Transform {
  const {doc} = tr;
  if (!doc) {
    return tr;
  }

  tr = tr.step(new SetDocAttrStep('width', width || null));
  tr = tr.step(new SetDocAttrStep('layout', layout || null));
  return tr;
}

class DocLayoutCommand extends UICommand {
  _popUp = null;

  isEnabled = (state: EditorState): boolean => {
    return true;
  };

  isActive = (state: EditorState): boolean => {
    return !!this._popUp;
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

    const {doc} = state;

    return new Promise(resolve => {
      const props = {
        initialValue: doc.attrs,
      };
      this._popUp = createPopUp(DocLayoutEditor, props, {
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
    inputs: ?DocLayoutEditorValue
  ): boolean => {
    if (dispatch) {
      const {selection, schema} = state;
      let {tr} = state;
      // tr = view ? hideCursorPlaceholder(view.state) : tr;
      tr = tr.setSelection(selection);

      if (inputs) {
        const {width, layout} = inputs;
        tr = setDocLayout(tr, schema, width, layout);
      }
      dispatch(tr);
      view && view.focus();
    }

    return false;
  };
}

export default DocLayoutCommand;
