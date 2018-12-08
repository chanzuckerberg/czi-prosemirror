// @flow

import UICommand from './ui/UICommand';
import noop from './noop';
import toggleList from './toggleList';
import {BULLET_LIST, ORDERED_LIST} from './NodeNames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';


// https://github.com/atlassian/prosemirror-utils/tree/master/src
// https://bitbucket.org/atlassian/atlaskit/src/34facee3f46197fefa8b8e22e83afd83d4d48f94/packages/editor-core/src/plugins/lists/?at=master
class ListToggleCommand extends UICommand {

  _ordered: boolean;

  constructor(ordered: boolean,) {
    super();
    this._ordered = ordered;
  }

  isActive = (state: EditorState): boolean => {
    if (this._ordered) {
      return !!this._findList(state, ORDERED_LIST);
    } else {
      return !!this._findList(state, BULLET_LIST);
    }
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection, schema} = state;
    const nodeType = schema.nodes[this._ordered ? ORDERED_LIST : BULLET_LIST];
    let {tr} = state;
    if (!nodeType) {
      return tr;
    }

    tr = toggleList(
      tr.setSelection(selection),
      schema,
      nodeType,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr);
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


export default ListToggleCommand;
