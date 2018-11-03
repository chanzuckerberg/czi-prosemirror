// @flow

import Command from '../Command';
import CommandMenu from './CommandMenu';
import CustomButton from './CustomButton';
import React from 'react';
import createPopUp from './createPopUp';
import cx from 'classnames';
import uuid from 'uuid/v1';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import './czi-custom-menu-button.css';

class CommandMenuButton extends React.PureComponent<any, any, any> {

  props: {
    commandGroups: Array<{[string]: Command}>,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    label: string,
  };

  _menu = null;
  _id = uuid();

  state = {
    expanded: false,
  };

  render(): React.Element<any> {
    const {label, commandGroups, editorState, editorView} = this.props;
    const enabled = commandGroups.some((group, ii) => {
      return Object.keys(group).some(label => {
        const command = group[label];
        let disabled = true;
        try {
          disabled = !editorView || !command.isEnabled(editorState);
        } catch (ex) {
          disabled = false;
        }
        return !disabled;
      });
    });

    const {expanded} = this.state;
    const className = cx({
      'czi-custom-menu-button': true,
      expanded,
    });
    return (
      <CustomButton
        className={className}
        disabled={!enabled}
        id={this._id}
        label={label}
        onClick={this._onClick}
      />
    );
  }

  componentWillUnmount(): void {
    this._hideMenu();
  }

  _onClick = (): void => {
    const expanded = !this.state.expanded;
    this.setState({
      expanded,
    });
    expanded ? this._showMenu() : this._hideMenu();
  };

  _hideMenu = (): void => {
    const menu = this._menu;
    menu && menu.dispose();
    this._menu = null;
  };

  _showMenu = (): void => {
    const menu = this._menu;
    const menuProps = {
      ...this.props,
      autoDismiss: true,
      onCommand: this._onCommand,
      target: this._id,
    };
    if (menu) {
      menu.update(menuProps);
    } else {
      this._menu = createPopUp(CommandMenu, menuProps, this._onClose);
    }
  };

  _onCommand = (): void => {
    this.setState({expanded: false});
    this._hideMenu();
  };

  _onClose = (): void => {
    this.setState({expanded: false});
    this._menu = null;
  };
}


export default CommandMenuButton;
