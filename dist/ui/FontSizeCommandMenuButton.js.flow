// @flow

import CommandMenuButton from './CommandMenuButton';
import FontSizeCommand from '../FontSizeCommand';
import Icon from './Icon';
import React from 'react';
import UICommand from './UICommand';
import cx from 'classnames';
import findActiveFontSize from './findActiveFontSize';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {HEADING} from '../NodeNames';
import {MARK_FONT_SIZE} from '../MarkNames';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

const FONT_PT_SIZES = [8, 9, 11, 10, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];

const FONT_PT_SIZE_COMMANDS = FONT_PT_SIZES.reduce((memo, size) => {
  memo[` ${size} `] = new FontSizeCommand(size);
  return memo;
}, {});

const COMMAND_GROUPS = [
  {'Default': new FontSizeCommand(0)},
  FONT_PT_SIZE_COMMANDS,
];

class FontSizeCommandMenuButton extends React.PureComponent<any, any, any> {

  props: {
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
  };

  render(): React.Element<any> {
    const {dispatch, editorState, editorView} = this.props;
    const fontSize = findActiveFontSize(editorState);
    return (
      <CommandMenuButton
        commandGroups={COMMAND_GROUPS}
        dispatch={dispatch}
        editorState={editorState}
        editorView={editorView}
        label={fontSize}
      />
    );
  }
}

export default FontSizeCommandMenuButton;
