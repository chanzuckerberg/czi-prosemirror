// @flow

import Command from './Command';
import noop from './noop';
import nullthrows from 'nullthrows';
import toggleHeading from './toggleHeading';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {HEADING, PARAGRAPH} from './NodeNames';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';

import type {ExecuteCall, FindNodeTypeInSelectionCall} from './Command';

class HeadingCommand extends Command {

  _findHeading: FindNodeTypeInSelectionCall;
  _level: number;
  _schema: Schema;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();

    const heading = schema.nodes[HEADING];

    this._level = level;
    this._schema = schema;
    this._findHeading = heading ? findParentNodeOfType(heading) : noop;
  }

  isActive = (state: EditorState): boolean => {
    const result = this._findHeading(state.selection);
    return !!(
      result &&
      result.node &&
      result.node.attrs &&
      result.node.attrs.level === this._level
    );
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection} = state;
    const tr = toggleHeading(
      state.tr.setSelection(selection),
      this._schema,
      this._level,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };
}

export default HeadingCommand;
