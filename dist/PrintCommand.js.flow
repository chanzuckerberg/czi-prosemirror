// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import UICommand from './ui/UICommand';

class PrintCommand extends UICommand {
  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (state: EditorState): boolean => {
    return !!window.print;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView
  ): boolean => {
    if (dispatch && window.print) {
      window.print();
      return true;
    }
    return false;
  };
}

export default PrintCommand;
