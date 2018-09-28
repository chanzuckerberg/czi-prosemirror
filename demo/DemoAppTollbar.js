// @flow

import CommandButtonComponent from '../src/CommandButtonComponent';
import React from 'react';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import {
  HISTORY_REDO,
  HISTORY_UNDO,
} from '../src/configs';

const Commands = {
  'Undo': HISTORY_UNDO,
  'Redo': HISTORY_REDO,
};

class DemoAppTollbar extends React.PureComponent<any, any, any> {

  props: {
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
  };

  render(): React.Element<any> {
    const buttons = Object.keys(Commands).map(this._renderButton);
    return (
      <div className="demo-app-toolbar">
        {buttons}
      </div>
    )
  }
  _renderButton = (label: string): React.Element<any> => {
    const command = Commands[label];
    const {editorState, editorView, dispatch} = this.props;
    return (
      <CommandButtonComponent
        command={command}
        editorState={editorState}
        editorView={editorView}
        key={label}
        label={label}
        dispatch={dispatch}
      />
    );
  };
}

export default DemoAppTollbar;
