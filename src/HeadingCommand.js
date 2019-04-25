// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {EditorView} from 'prosemirror-view';

import {HEADING} from './NodeNames';
import noop from './noop';
import toggleHeading from './toggleHeading';
import UICommand from './ui/UICommand';

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
    view: ?EditorView
  ): boolean => {
    const {schema, selection} = state;
    const tr = toggleHeading(
      state.tr.setSelection(selection),
      schema,
      this._level
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr);
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
