// @flow

import {Schema} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import splitListItem from './splitListItem';
import UICommand from './ui/UICommand';

class ListSplitCommand extends UICommand {
  constructor(schema: Schema) {
    super();
  }

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView
  ): boolean => {
    const {selection, schema} = state;
    const tr = splitListItem(state.tr.setSelection(selection), schema);
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
}

export default ListSplitCommand;
