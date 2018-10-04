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
  OL,
  UL,
  LIST_INDENT_MORE,
  LIST_INDENT_LESS,
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
    'Undo': HISTORY_UNDO,
    'Redo': HISTORY_REDO,
  },
];

class DemoAppTollbar extends React.PureComponent<any, any, any> {

  props: {
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
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
    const {editorState, editorView, dispatch} = this.props;
    return (
      <CommandButtonComponent
        command={command}
        editorState={editorState}
        editorView={editorView}
        key={label}
        label={label}
        dispatch={dispatch}
      />
    );
  };
}

export default DemoAppTollbar;
