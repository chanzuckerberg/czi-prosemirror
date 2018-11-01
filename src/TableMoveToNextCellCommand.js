// @flow

import Command from './Command';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {goToNextCell} from 'prosemirror-tables';

import type {ExecuteCall, FindNodeTypeInSelectionCall} from './Command';

class TableMoveToNextCellCommand extends Command {

  _schema: Schema;
  _command: (state: EditorState, dispatch: ?(tr: Transform) => void) => boolean;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();
    this._schema = schema;
    this._command = goToNextCell(1);
  }

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    return this._command(state, dispatch);
  };
}

export default TableMoveToNextCellCommand;
