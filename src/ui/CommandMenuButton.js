// @flow

import CommandMenu from './CommandMenu';
import CustomButton from './CustomButton';
import Icon from './Icon';
import React from 'react';
import UICommand from './UICommand';
import createPopUp from './createPopUp';
import cx from 'classnames';
import uuid from './uuid';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import './czi-custom-menu-button.css';

class CommandMenuButton extends React.PureComponent<any, any, any> {

  props: {
    commandGroups: Array<{[string]: UICommand}>,
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
        icon={Icon.forLabel(label)}
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
    this._menu = null;
    menu && menu.close();
  };

  _showMenu = (): void => {
    const menu = this._menu;
    const menuProps = {
      ...this.props,
      onCommand: this._onCommand,
    };
    if (menu) {
      menu.update(menuProps);
    } else {
      this._menu = createPopUp(CommandMenu, menuProps, {
        anchor: document.getElementById(this._id),
        onClose: this._onClose,
      });
    }
  };

  _onCommand = (): void => {
    this.setState({expanded: false});
    this._hideMenu();
  };

  _onClose = (): void => {
    if (this._menu) {
      this.setState({expanded: false});
      this._menu = null;
    }
  };
}


export default CommandMenuButton;
