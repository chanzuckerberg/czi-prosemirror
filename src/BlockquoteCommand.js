// @flow

import UICommand from './ui/UICommand';
import noop from './noop';
import nullthrows from 'nullthrows';
import toggleBlockquote from './toggleBlockquote';
import {BLOCKQUOTE, PARAGRAPH} from './NodeNames';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

let findBlockQuote

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
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };
}

export default BlockquoteCommand;
