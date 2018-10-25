// @flow

import Command from '../src/Command';
import React from 'react';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandButtonTemplate extends React.PureComponent<any, any, any> {

  render(): React.Element<any> {
    const {
      active,
      disabled,
      label,
      onMouseDown,
      onMouseUp,
      pressed,
    } = this.props;

    const className = cx({
      'active': active,
      'command-button-component': true,
      'disabled': disabled,
      'pressed': pressed,
    });

    return (
      <span
        aria-pressed={pressed}
        className={className}
        onKeyPress={disabled ? null : onMouseUp}
        onMouseDown={disabled ? null : onMouseDown}
        onMouseUp={disabled ? null : onMouseUp}
        role="button"
        tabIndex={0}>
        {label}
      </span>
    )
  }
}

class CommandButtonComponent extends React.PureComponent<any, any, any> {

  props: {
    command: Command,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    label: string,
  };

  _pressedTarget = null;

  state = {pressed: false};

  render(): React.Element<any> {
    const {label, command, editorState, editorView} = this.props;
    const {pressed} = this.state;
    let disabled = true;
    try {
       disabled = !editorView || !command.isEnabled(editorState);
    } catch (ex) {
      //
    }
    return (
      <CommandButtonTemplate
        active={command.isActive(editorState)}
        disabled={disabled}
        label={label}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        pressed={pressed}
      />
    );
  }

  _onMouseDown = (e: SyntheticEvent): void => {
    e.preventDefault();
    this.setState({pressed: true});
    this._pressedTarget = e.currentTarget;
  };

  _onMouseUp = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (e.currentTarget === this._pressedTarget || e.type === 'keypress') {
      const {command, editorState, dispatch, editorView} = this.props;
      command.execute(editorState, dispatch, editorView);
    }
    this.setState({pressed: false});
    this._pressedTarget = null;
  };
}

export default CommandButtonComponent;
