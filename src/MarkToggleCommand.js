// @flow

import UICommand from './ui/UICommand';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';
import {toggleMark} from 'prosemirror-commands';
import findNodesWithSameMark from './findNodesWithSameMark';

class MarkToggleCommand extends UICommand {

  _markName: string;

  constructor(markName: string) {
    super();
    this._markName = markName;
  }

  isActive = (state: EditorState): boolean => {
    const {schema, doc, selection} = state;
    const {from, to} = selection;
    const markType = schema.marks[this._markName];
    if (markType && from < to) {
      return !!findNodesWithSameMark(doc, from, to - 1, markType);
    }
    return false;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {schema, selection} = state;
    if (selection.empty) {
      return false;
    }
    const markType = schema.marks[this._markName];
    if (!markType) {
      return false;
    }

    // TODO: Replace `toggleMark` with transform that does not change scroll
    // position.
    return toggleMark(markType)(state, dispatch, view);
  };
}

export default MarkToggleCommand;
