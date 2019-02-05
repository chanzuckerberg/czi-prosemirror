// @flow
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import CommandMenuButton  from './CommandMenuButton';
import {TABLE_COMMANDS_GROUP} from './EditorToolbarConfig';
import Icon from './Icon';

import './czi-table-cell-tooltip.css';

type Props = {
  editorState: EditorState,
  editorView: EditorView,
};


class TableCellTooltip extends React.PureComponent<any, any, any> {
  _menu = null;

  props: Props;

  render(): ?React.Element<any> {
    const {editorState, editorView} = this.props;
    return (
      <CommandMenuButton
        className="czi-table-cell-tooltip"
        commandGroups={TABLE_COMMANDS_GROUP}
        dispatch={editorView.dispatch}
        editorState={editorState}
        editorView={editorView}
        icon={Icon.get('edit')}
        title="Edit"
      />
    );
  }
}

export default TableCellTooltip;