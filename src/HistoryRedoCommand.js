// @flow

import Icon from './ui/Icon';
import React from 'react';
import UICommand from './ui/UICommand';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';
import {redo} from 'prosemirror-history';

class HistoryRedoCommand extends UICommand {
  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    return redo(state, dispatch);
  };
}

export default HistoryRedoCommand;
