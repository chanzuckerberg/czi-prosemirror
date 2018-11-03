// @flow

import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

export type ExecuteCall =  (
  state: EditorState,
  dispatch: ?(tr: Transform) => void,
  view: ?EditorView,
) => boolean;

export type IsActiveCall = (
  state: EditorState,
) => boolean;

export type FindNodeTypeInSelectionCall = (
  selection: Selection,
) => Object;

class Command {

  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (state: EditorState): boolean => {
    return this.execute(state);
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent,
  ): boolean => {
    this.waitForUserInput(state, event).then(inputs => {
      this.executeWithUserInput(
        state,
        dispatch,
        view,
        inputs,
      );
    }).catch(error => {
      console.error(error);
    })
    return false;
  };

  waitForUserInput = (
    state: EditorState,
    event: ?SyntheticEvent,
  ): Promise<any> => {
    return Promise.resolve(null);
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    inputs: any,
  ): boolean => {
    return false;
  };
}

export default Command;
