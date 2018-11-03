// @flow

import Command from '../Command';
import CommandButton from './CommandButton';
import CustomMenu from './CustomMenu';
import CustomMenuItem from './CustomMenuItem';
import React from 'react';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandMenu extends React.PureComponent<any, any, any> {

  props: {
    commandGroups: Array<{[string]: Command}>,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    onCommand: ?Function,
  };

  render(): React.Element<any> {
    const {commandGroups, dispatch, editorState, editorView} = this.props;
    const children = [];
    const jj = commandGroups.length - 1;

    commandGroups.forEach((group, ii) => {
      Object.keys(group).forEach(label => {
        const command = group[label];
        let disabled = true;
        try {
          disabled = !editorView || !command.isEnabled(editorState);
        } catch (ex) {
          disabled = false;
        }
        children.push(
          <CustomMenuItem
            disabled={disabled}
            key={label}
            label={label}
            onClick={this._onMenuItemClick}
            value={command}
          />
        );
      });
      if (ii !== jj) {
        children.push(
          <CustomMenuItem.Separator key={`${String(ii)}-hr`}/>
        );
      }
    });
    return (
      <CustomMenu>
        {children}
      </CustomMenu>
    );
  }

  _onMenuItemClick = (command: Command, e: SyntheticEvent) => {
    const {dispatch, editorState, editorView, onCommand} = this.props;
    if (command.execute(editorState, dispatch, editorView, e)) {
      onCommand && onCommand();
    }
  };
}


export default CommandMenu;
