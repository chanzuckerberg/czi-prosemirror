// @flow

import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

export type IsActiveCall = (
  state: EditorState,
) => boolean;

export type FindNodeTypeInSelectionCall = (
  selection: Selection,
) => Object;

const EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter',
};

class UICommand {

  static EventType = EventType;

  shouldRespondToUIEvent = (e: (SyntheticEvent | MouseEvent)): boolean => {
    return e.type === UICommand.EventType.CLICK;
  };

  renderLabel = (state: EditorState): any => {
    return null;
  };

  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (state: EditorState, view: ?EditorView): boolean => {
    return this.execute(state, null, view);
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent,
  ): boolean => {
    this.waitForUserInput(state, dispatch, view, event).then(inputs => {
      this.executeWithUserInput(
        state,
        dispatch,
        view,
        inputs,
      );
    }).catch(error => {
      console.error(error);
    });
    return false;
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent,
  ): Promise<any> => {
    return Promise.resolve(undefined);
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

export default UICommand;
