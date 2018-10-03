// @flow

import Command from './Command';
import lift from './lift';
import nullthrows from 'nullthrows';
import sinkListItem from './sinkListItem';
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
    const bulletList = nullthrows(schema.nodes.bullet_list);
    const orderedList = nullthrows(schema.nodes.ordered_list);
    this._delta = delta;
    this._schema = schema;
    this._findBulletList = findParentNodeOfType(bulletList);
    this._findOrderedList = findParentNodeOfType(orderedList);
  }

  isActive = (state: EditorState): boolean => {
    const {selection} = state;
    return !!(
      this._findOrderedList(selection) ||
      this._findBulletList(selection)
    );
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    let {selection, tr} = state;
    tr = tr.setSelection(selection);
    tr = sinkListItem(
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
