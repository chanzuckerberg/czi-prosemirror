// @flow

import Command from './Command';
import nullthrows from 'nullthrows';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';

import type {ExecuteCall} from './Command';

class HeadingCommand extends Command {

  _disable: ExecuteCall;
  _enable: ExecuteCall;
  _findHeading: (sel: Selection) => Object;
  _level: number;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();

    const heading = nullthrows(schema.nodes.heading);
    const paragraph = nullthrows(schema.nodes.paragraph);
    this._level = level;
    this._findHeading = findParentNodeOfType(heading);
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

  isEnabled = (): boolean => {
    // TODO: Find out when this should not be enabled.
    // (e.g. Selection is an iamge or a list).
    return true;
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
