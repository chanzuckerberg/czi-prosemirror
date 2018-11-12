// @flow

import UICommand from './ui/UICommand';
import noop from './noop';
import nullthrows from 'nullthrows';
import toggleCodeBlock from './toggleCodeBlock';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {CODE_BLOCK, PARAGRAPH} from './NodeNames';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';

import type {ExecuteCall, FindNodeTypeInSelectionCall} from './ui/UICommand';

class CodeBlockCommand extends UICommand {

  _findCodeBlock: FindNodeTypeInSelectionCall;

  isActive = (state: EditorState): boolean => {
    const result = this._findCodeBlock(state);
    return !!(
      result &&
      result.node
    );
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection, schema} = state;
    let {tr} = state;
    tr = tr.setSelection(selection);
    tr = toggleCodeBlock(
      tr,
      schema,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
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
