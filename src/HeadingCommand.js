// @flow

import Command from './Command';
import nullthrows from 'nullthrows';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {HEADING, PARAGRAPH} from './NodeNames';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';

import type {ExecuteCall, FindNodeTypeInSelectionCall} from './Command';

class HeadingCommand extends Command {

  _disable: ExecuteCall;
  _enable: ExecuteCall;
  _findHeading: FindNodeTypeInSelectionCall;
  _findParagraph: FindNodeTypeInSelectionCall;
  _level: number;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();

    const heading = nullthrows(schema.nodes[HEADING]);
    const paragraph = nullthrows(schema.nodes[PARAGRAPH]);
    this._level = level;
    this._findHeading = findParentNodeOfType(heading);
    this._findParagraph = findParentNodeOfType(paragraph);
    this._enable = setBlockType(heading, {level});
    this._disable = setBlockType(paragraph, {});
  }

  isActive = (state: EditorState): boolean => {
    const result = this._findHeading(state.selection);
    return !!(
      result &&
      result.node &&
      result.node.attrs &&
      result.node.attrs.level === this._level
    );
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    if (this.isActive(state)) {
      return this._disable(state, dispatch);
    } else {
      return this._enable(state, dispatch);
    }
  };
}

export default HeadingCommand;
