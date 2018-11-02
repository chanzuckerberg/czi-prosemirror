// @flow

import Command from '../src/Command';
import React from 'react';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandMenuButtonTemplate extends React.PureComponent<any, any, any> {

  render(): React.Element<any> {
    const {
      active,
      label,
      onMouseDown,
      onMouseUp,
      pressed,
    } = this.props;

    const className = cx({
      'active': active,
      'command-button-component': true,
      'command-menu-button-component': true,
      'pressed': pressed,
    });

    return (
      <span
        aria-pressed={pressed}
        className={className}
        onKeyPress={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        role="button"
        tabIndex={0}>
        {label}
      </span>
    )
  }
}

class CommandMenuButtonComponent extends React.PureComponent<any, any, any> {

  props: {
    commandGroups: Array<{[string]: Command}>,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    label: string,
  };

  _pressedTarget = null;

  state = {pressed: false, active: false};

  render(): React.Element<any> {
    const {label, commandGroups, editorState, editorView} = this.props;
    const {pressed} = this.state;
    return (
      <CommandMenuButtonTemplate
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
      this.setState({active: true});
    }
    this.setState({pressed: false});
    this._pressedTarget = null;
  };
}

export default CommandMenuButtonComponent;
