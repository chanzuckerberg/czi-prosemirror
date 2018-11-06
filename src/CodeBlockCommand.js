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
  _schema: Schema;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();

    const codeBlock = schema.nodes[CODE_BLOCK];
    this._schema = schema;
    this._findCodeBlock = codeBlock ? findParentNodeOfType(codeBlock) : noop;
  }

  isActive = (state: EditorState): boolean => {
    const result = this._findCodeBlock(state.selection);
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
    const {selection} = state;
    const tr = toggleCodeBlock(
      state.tr.setSelection(selection),
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

export default CodeBlockCommand;
