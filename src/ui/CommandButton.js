// @flow

import CustomButton from './CustomButton';
import React from 'react';
import UICommand from './UICommand';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandButton extends React.PureComponent<any, any, any> {

  props: {
    className?: ?string,
    command: UICommand,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    label: string,
  };

  render(): React.Element<any> {
    const {label, className, command, editorState, editorView} = this.props;
    let disabled = true;
    try {
       disabled = !editorView || !command.isEnabled(editorState);
    } catch (ex) {
      //
    }
    const {CLICK, MOUSE_ENTER} = UICommand.EventType;
    const eType = command.getUIEventType();
    const props = {
      active: command.isActive(editorState),
      className,
      disabled,
      label,
      onClick: eType === CLICK ? this._execute : null,
      onMouseEnter: eType === MOUSE_ENTER ? this._execute : null,
    };
    return (
      <CustomButton
        {...props}
      />
    );
  }

  _execute = (value: any, event: SyntheticEvent): void => {
    const {command, editorState, dispatch, editorView} = this.props;
    command.execute(editorState, dispatch, editorView, event);
  };
}

export default CommandButton;
