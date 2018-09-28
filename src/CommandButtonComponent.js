// @flow

import Command from '../src/Command';
import React from 'react';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandButtonTemplate extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    const {
      label,
      disabled,
      onMouseUp,
      onMouseDown,
    } = this.props;
    return (
      <button
        disabled={disabled}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className="command-button-component">
        {label}
      </button>
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

  render(): React.Element<any> {
    const {label, command, editorState} = this.props;
    return (
      <CommandButtonTemplate
        disabled={!command.isEnabled(editorState)}
        label={label}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
      />
    );
  }
  _onMouseDown = (e: SyntheticEvent): void => {
    e.preventDefault();
    this._pressedTarget = e.currentTarget;
  };

  _onMouseUp = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (e.currentTarget === this._pressedTarget) {
      const {command, editorState, dispatch, editorView} = this.props;
      command.execute(editorState, dispatch, editorView);
    }
    this._pressedTarget = null;
  };
}

export default CommandButtonComponent;
