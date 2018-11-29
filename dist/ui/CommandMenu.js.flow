// @flow

import CommandButton from './CommandButton';
import CustomMenu from './CustomMenu';
import CustomMenuItem from './CustomMenuItem';
import React from 'react';
import UICommand from './UICommand';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandMenu extends React.PureComponent<any, any, any> {

  props: {
    commandGroups: Array<{[string]: UICommand}>,
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
          disabled = !editorView || !command.isEnabled(editorState, editorView);
        } catch (ex) {
          disabled = false;
        }
        children.push(
          <CustomMenuItem
            active={command.isActive(editorState)}
            disabled={disabled}
            key={label}
            label={command.renderLabel(editorState) || label}
            onClick={this._onUIEnter}
            onMouseEnter={this._onUIEnter}
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

  _onUIEnter = (command: UICommand, event: SyntheticEvent): void => {
    if (command.shouldRespondToUIEvent(event)) {
      this._execute(command, event);
    }
  };

  _execute = (command: UICommand, e: SyntheticEvent) => {
    const {dispatch, editorState, editorView, onCommand} = this.props;
    if (command.execute(editorState, dispatch, editorView, e)) {
      onCommand && onCommand();
    }
  };
}


export default CommandMenu;
