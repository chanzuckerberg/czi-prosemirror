// @flow

import Command from './Command';
import splitListItem from './splitListItem';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema, NodeType} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

class ListSplitCommand extends Command {
  _schema: Schema;

  constructor(schema: Schema) {
    super();
    this._schema = schema;
  }

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection,} = state;
    const tr = splitListItem(state.tr.setSelection(selection), this._schema);
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };
}


export default ListSplitCommand;
