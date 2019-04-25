// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {EditorView} from 'prosemirror-view';

import {CODE_BLOCK} from './NodeNames';
import noop from './noop';
import toggleCodeBlock from './toggleCodeBlock';
import UICommand from './ui/UICommand';

class CodeBlockCommand extends UICommand {
  isActive = (state: EditorState): boolean => {
    const result = this._findCodeBlock(state);
    return !!(result && result.node);
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView
  ): boolean => {
    const {selection, schema} = state;
    let {tr} = state;
    tr = tr.setSelection(selection);
    tr = toggleCodeBlock(tr, schema);
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };

  _findCodeBlock(state: EditorState): ?Object {
    const codeBlock = state.schema.nodes[CODE_BLOCK];
    const findCodeBlock = codeBlock ? findParentNodeOfType(codeBlock) : noop;
    return findCodeBlock(state.selection);
  }
}

export default CodeBlockCommand;
