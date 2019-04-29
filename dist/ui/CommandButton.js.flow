// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import CustomButton from './CustomButton';
import UICommand from './UICommand';

class CommandButton extends React.PureComponent<any, any, any> {
  props: {
    className?: ?string,
    command: UICommand,
    disabled?: ?boolean,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    icon?: string | React.Element<any> | null,
    label?: string | React.Element<any> | null,
    title?: ?string,
  };

  render(): React.Element<any> {
    const {
      label,
      className,
      command,
      editorState,
      editorView,
      icon,
      title,
    } = this.props;
    let disabled = this.props.disabled;
    if (!!disabled === false) {
      disabled = !editorView || !command.isEnabled(editorState, editorView);
    }
    return (
      <CustomButton
        active={command.isActive(editorState)}
        className={className}
        disabled={disabled}
        icon={icon}
        label={label}
        onClick={this._onUIEnter}
        onMouseEnter={this._onUIEnter}
        title={title}
        value={command}
      />
    );
  }

  _onUIEnter = (command: UICommand, event: SyntheticEvent): void => {
    if (command.shouldRespondToUIEvent(event)) {
      this._execute(command, event);
    }
  };

  _execute = (value: any, event: SyntheticEvent): void => {
    const {command, editorState, dispatch, editorView} = this.props;
    command.execute(editorState, dispatch, editorView, event);
  };
}

export default CommandButton;
