// @flow

import UICommand from './ui/UICommand';
import noop from './noop';
import updateIndentLevel from './updateIndentLevel';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema, NodeType} from 'prosemirror-model';
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
    let {selection, tr, schema} = state;
    tr = tr.setSelection(selection);
    tr = updateIndentLevel(tr, schema, this._delta);
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };
}

export default IndentCommand;
