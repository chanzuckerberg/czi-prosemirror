// @flow

import CommandMenuButton from './CommandMenuButton';
import FontTypeCommand from '../FontTypeCommand';
import React from 'react';
import findActiveFontType from './findActiveFontType';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {FONT_TYPE_NAMES} from '../FontTypeMarkSpec';
import {FONT_TYPE_NAME_DEFAULT} from './findActiveFontType';
import {Transform} from 'prosemirror-transform';

const FONT_TYPE_COMMANDS: Object = {
  [FONT_TYPE_NAME_DEFAULT]: new FontTypeCommand(''),
};

FONT_TYPE_NAMES.forEach(name => {
  FONT_TYPE_COMMANDS[name] = new FontTypeCommand(name);
});

const COMMAND_GROUPS = [FONT_TYPE_COMMANDS];

class FontTypeCommandMenuButton extends React.PureComponent<any, any, any> {
  props: {
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
  };

  render(): React.Element<any> {
    const {dispatch, editorState, editorView} = this.props;
    const fontType = findActiveFontType(editorState);
    return (
      <CommandMenuButton
        className="width-100"
        disabled={editorView && editorView.disabled? true:false}
        commandGroups={COMMAND_GROUPS}
        dispatch={dispatch}
        editorState={editorState}
        editorView={editorView}
        label={fontType}
      />
    );
  }
}

export default FontTypeCommandMenuButton;
