// @flow

import UICommand from './ui/UICommand';
import updateIndentLevel from './updateIndentLevel';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class IndentCommand extends UICommand {
  _delta: number;

  constructor(delta: number) {
    super();
    this._delta = delta;
  }

  isActive = (state: EditorState): boolean => {
    return false;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection, schema} = state;
    let {tr} = state;
    tr = tr.setSelection(selection);
    tr = updateIndentLevel(tr, schema, this._delta);
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
}

export default IndentCommand;
