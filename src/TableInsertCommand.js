// @flow

import Command from './Command';
import TableGridSizeSelector from './ui/TableGridSizeSelector';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

class TableInsertCommand extends Command {
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
    return new Promise(resolve => {
      const node = nullthrows(event).currentTarget;
      const viewProps = {
        target: nullthrows(node),
        position: 'right',
      };
      createPopUp(TableGridSizeSelector, viewProps);
    });
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

export default TableInsertCommand;
