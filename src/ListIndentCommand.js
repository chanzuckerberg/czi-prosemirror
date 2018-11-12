// @flow

import UICommand from './ui/UICommand';
import noop from './noop';
import setListNodeLevel from './setListNodeLevel';
import toggleList from './toggleList';
import {BULLET_LIST, ORDERED_LIST} from './NodeNames';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema, NodeType} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

class ListIndentCommand extends UICommand {
  _delta: number;

  constructor(delta: number) {
    super();
    this._delta = delta;
  }

  isActive = (state: EditorState): boolean => {
    const {selection} = state;
    const found =
      this._findList(state, BULLET_LIST) ||
      this._findList(state, ORDERED_LIST);
    const level = found ? found.node.attrs.level : 0;
    return level > 1;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    let {selection, tr, schema} = state;
    tr = tr.setSelection(selection);

    tr = setListNodeLevel(
      tr,
      schema,
      this._delta,
    );

    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };

  _findList(state: EditorState, type: string): ?Object {
    const {nodes} = state.schema;
    const list = nodes[type];
    const findList = list ?
      findParentNodeOfType(list) :
      noop;
    return findList(state.selection);
  }
}

export default ListIndentCommand;
