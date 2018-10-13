// @flow

import Command from './Command';
import indentListItemMore from './indentListItemMore';
import lift from './lift';
import noop from './noop';
import toggleList from './toggleList';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema, NodeType} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';

import type {ExecuteCall, FindNodeTypeInSelectionCall} from './Command';

class ListIndentCommand extends Command {
  _delta: number;
  _schema: Schema;
  _findBulletList: FindNodeTypeInSelectionCall;
  _findOrderedList: FindNodeTypeInSelectionCall;

  constructor(
    schema: Schema,
    delta: number,
  ) {
    super();
    const {bullet_list, ordered_list} = schema.nodes;
    this._delta = delta;
    this._schema = schema;
    this._findBulletList = bullet_list ?
      findParentNodeOfType(bullet_list) :
      noop;
    this._findOrderedList = ordered_list ?
      findParentNodeOfType(ordered_list) :
      noop;
  }

  isActive = (state: EditorState): boolean => {
    const {selection} = state;
    return !!(
      this._findOrderedList(selection) ||
      this._findBulletList(selection)
    );
  };

  isEnabled = (): boolean => {
    return true;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    let {selection, tr} = state;
    tr = tr.setSelection(selection);
    tr = indentListItemMore(
      tr,
      this._schema,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };
}

export default ListIndentCommand;
