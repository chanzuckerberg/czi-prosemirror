// @flow

import CustomButton from './CustomButton';
import Command from '../Command';
import React from 'react';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandButton extends React.PureComponent<any, any, any> {

  props: {
    command: Command,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    label: string,
  };

  render(): React.Element<any> {
    const {label, command, editorState, editorView} = this.props;
    let disabled = true;
    try {
       disabled = !editorView || !command.isEnabled(editorState);
    } catch (ex) {
      //
    }
    return (
      <CustomButton
        active={command.isActive(editorState)}
        disabled={disabled}
        label={label}
        onClick={this._onClick}
      />
    );
  }

  _onClick = (): void => {
    const {command, editorState, dispatch, editorView} = this.props;
    command.execute(editorState, dispatch, editorView);
  };
}

export default CommandButton;
