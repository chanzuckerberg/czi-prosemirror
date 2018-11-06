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
    const {CLICK, MOUSE_ENTER} = UICommand.EventType;

    commandGroups.forEach((group, ii) => {
      Object.keys(group).forEach(label => {
        const command = group[label];
        let disabled = true;
        try {
          disabled = !editorView || !command.isEnabled(editorState);
        } catch (ex) {
          disabled = false;
        }

        const eType = command.getUIEventType();

        const props = {
          active: command.isActive(editorState),
          disabled,
          label,
          onClick: eType === CLICK ? this._execute : null,
          onMouseEnter: eType === MOUSE_ENTER ? this._execute : null,
          value: command,
        };

        children.push(
          <CustomMenuItem
            key={label}
            {...props}
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

  _execute = (command: UICommand, e: SyntheticEvent) => {
    const {dispatch, editorState, editorView, onCommand} = this.props;
    if (command.execute(editorState, dispatch, editorView, e)) {
      onCommand && onCommand();
    }
  };
}


export default CommandMenu;
