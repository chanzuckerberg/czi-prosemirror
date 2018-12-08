// @flow

import UICommand from './ui/UICommand';
import toggleBlockquote from './toggleBlockquote';
import {BLOCKQUOTE} from './NodeNames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

class BlockquoteCommand extends UICommand {

  isActive = (state: EditorState): boolean => {
    const blockquote = state.schema.nodes[BLOCKQUOTE];
    return !!(blockquote && findParentNodeOfType(blockquote)(state.selection));
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {schema, selection} = state;
    const tr = toggleBlockquote(
      state.tr.setSelection(selection),
      schema,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
}

export default BlockquoteCommand;
