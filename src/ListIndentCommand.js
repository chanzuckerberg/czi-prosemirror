// @flow

import Command from './Command';
import indentListItemLess from './indentListItemLess';
import indentListItemMore from './indentListItemMore';
import lift from './lift';
import noop from './noop';
import toggleList from './toggleList';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MAX_INDENT_LEVEL} from './indentListItemMore';
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
    const found =
      this._findOrderedList(selection) ||
      this._findBulletList(selection);
    const level = found ? found.node.attrs.level : 0;
    return level > 1;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    let {selection, tr} = state;
    tr = tr.setSelection(selection);
    if (this._delta > 0) {
      tr = indentListItemMore(
        tr,
        this._schema,
      );
    } else if (this._delta < 0){
      tr = indentListItemLess(
        tr,
        this._schema,
      );
    }

    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };
}

export default ListIndentCommand;
