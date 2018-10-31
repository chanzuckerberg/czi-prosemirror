// @flow

import Command from '../src/Command';
import CommandButtonComponent from '../src/CommandButtonComponent';
import React from 'react';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import {
  H1,
  H2,
  H3,
  H4,
  HISTORY_REDO,
  HISTORY_UNDO,
  HR,
  OL,
  UL,
  LIST_INDENT_MORE,
  LIST_INDENT_LESS,
  EDITOR_EMPTY_STATE,
} from '../src/configs';

const CommandGroups = [
  {
    'H1': H1,
    'H2': H2,
    'H3': H3,
    'H4': H4,
  },
  {
    'OL': OL,
    'UL': UL,
    '->||': LIST_INDENT_MORE,
    '||<-': LIST_INDENT_LESS,
  },
  {
    'HR': HR,
  },
  {
    'Undo': HISTORY_UNDO,
    'Redo': HISTORY_REDO,
  },
];

class DemoAppTollbar extends React.PureComponent<any, any, any> {

  props: {
    editorState: EditorState,
    editorView: ?EditorView,
    onChange?: ?(state: EditorState) => void,
    onReady?: ?(view: EditorView) => void,
  };

  render(): React.Element<any> {
    return (
      <div className="demo-app-toolbar">
        {CommandGroups.map(this._renderButtonsGroup)}
      </div>
    );
  }

  _renderButtonsGroup = (group: Object, index: number): React.Element<any> => {
    const buttons = Object.keys(group).map(label => {
      const command = group[label];
      return this._renderButton(label, command);
    });
    return (
      <div key={'g' + String(index)} className="demo-app-toolbar-buttons-group">
        {buttons}
      </div>
    );
  };

  _renderButton = (label: string, command: Command): React.Element<any> => {
    const {editorState, editorView} = this.props;
    return (
      <CommandButtonComponent
        command={command}
        dispatch={this._dispatchTransaction}
        editorState={editorState || EDITOR_EMPTY_STATE}
        editorView={editorView}
        key={label}
        label={label}
      />
    );
  };

  _dispatchTransaction = (transaction: Transform): void => {
    const {onChange, editorState} = this.props;
    const nextState = (editorState || EDITOR_EMPTY_STATE).apply(transaction);
    onChange && onChange(nextState);
  };
}

export default DemoAppTollbar;
