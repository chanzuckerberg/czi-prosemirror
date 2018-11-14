// @flow

import UICommand from './ui/UICommand';
import noop from './noop';
import nullthrows from 'nullthrows';
import toggleHeading from './toggleHeading';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {HEADING, PARAGRAPH} from './NodeNames';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';

class HeadingCommand extends UICommand {

  _level: number;

  constructor(level: number) {
    super();
    this._level = level;
  }

  isActive = (state: EditorState): boolean => {
    const result = this._findHeading(state);
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
    const {schema, selection} = state;
    const tr = toggleHeading(
      state.tr.setSelection(selection),
      schema,
      this._level,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };

  _findHeading(state: EditorState): ?Object {
    const heading = state.schema.nodes[HEADING];
    const fn = heading ? findParentNodeOfType(heading) : noop;
    return fn(state.selection);
  }
}

export default HeadingCommand;
