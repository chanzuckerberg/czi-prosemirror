// @flow

import Command from '../Command';
import CustomButton from './CustomButton';
import React from 'react';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class CommandMenuButton extends React.PureComponent<any, any, any> {

  props: {
    commandGroups: Array<{[string]: Command}>,
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    label: string,
  };

  state = {
    opened: false,
  };

  render(): React.Element<any> {
    const {label, commandGroups, editorState, editorView} = this.props;

    return (
      <CustomButton
        label={label}
        onClick={this._onClick}
      />
    );
  }

  _onClick = (): void => {
    this.setState({
      opened: true,
    });
  };
}


export default CommandMenuButton;
