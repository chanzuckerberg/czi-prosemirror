// @flow

import './czi-editor-toolbar.css';
import * as EditorCommands from '../EditorCommands';
import CommandButton from './CommandButton';
import CommandMenuButton from './CommandMenuButton';
import React from 'react';
import UICommand from './UICommand';
import createEmptyEditorState from '../createEmptyEditorState';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

const EDITOR_EMPTY_STATE = createEmptyEditorState();

const {
  CLEAR_FORMAT,
  CODE,
  EM,
  FONT_SIZES,
  FONT_TYPES,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  HISTORY_REDO,
  HISTORY_UNDO,
  HR,
  IMAGE_FROM_URL,
  INDENT_LESS,
  INDENT_MORE,
  LINK_SET_URL,
  OL,
  STRIKE,
  STRONG,
  TABLE_ADD_COLUMN_AFTER,
  TABLE_ADD_COLUMN_BEFORE,
  TABLE_ADD_ROW_AFTER,
  TABLE_ADD_ROW_BEFORE,
  TABLE_CELL_COLOR,
  TABLE_DELETE_COLUMN,
  TABLE_DELETE_ROW,
  TABLE_DELETE_TABLE,
  TABLE_INSERT_TABLE,
  TABLE_MERGE_CELLS,
  TABLE_MOVE_TO_NEXT_CELL,
  TABLE_MOVE_TO_PREV_CELL,
  TABLE_SPLIT_CELL,
  TABLE_TOGGLE_HEADER_CELL,
  TABLE_TOGGLE_HEADER_COLUMN,
  TABLE_TOGGLE_HEADER_ROW,
  TEXT_ALIGN_CENTER,
  TEXT_ALIGN_JUSTIFY,
  TEXT_ALIGN_LEFT,
  TEXT_ALIGN_RIGHT,
  TEXT_COLOR,
  TEXT_HIGHLIGHT,
  TEXT_LINE_SPACINGS,
  UL,
  UNDERLINE,
} = EditorCommands;

const CommandGroups = [
  {
    undo: HISTORY_UNDO,
    redo: HISTORY_REDO,
  },
  {
    h1: H1,
    h2: H2,
    h3: H3,
    hn: [{
      h4: H4,
      h5: H5,
      h6: H6,
    }],
  },
  {
    font_types: FONT_TYPES,
    font_sizes: FONT_SIZES,
  },
  {
    ol: OL,
    ul: UL,
  },
  {
    text_color: TEXT_COLOR,
    text_highlight: TEXT_HIGHLIGHT,
    underline: UNDERLINE,
    strong: STRONG,
    em: EM,
    strike: STRIKE,
    clear_format: CLEAR_FORMAT,
  },
  {
    link: LINK_SET_URL,
    image: IMAGE_FROM_URL,
  },
  {
    text_align_left: TEXT_ALIGN_LEFT,
    text_align_center: TEXT_ALIGN_CENTER,
    text_align_right: TEXT_ALIGN_RIGHT,
    text_align_justify: TEXT_ALIGN_JUSTIFY,
  },
  {
    table: [
      {
        insert_table: TABLE_INSERT_TABLE,
      },
      {
        table_fill_color: TABLE_CELL_COLOR,
      },
      {
        insert_column_before: TABLE_ADD_COLUMN_BEFORE,
        insert_column_after: TABLE_ADD_COLUMN_AFTER,
        delete_column: TABLE_DELETE_COLUMN,
      },
      {
        insert_row_before: TABLE_ADD_ROW_BEFORE,
        insert_row_after: TABLE_ADD_ROW_AFTER,
        delete_row: TABLE_DELETE_ROW,
      },
      {
        merge_cells: TABLE_MERGE_CELLS,
        split_cells: TABLE_SPLIT_CELL,
      },
      // {
      //   toggle_header_column: TABLE_TOGGLE_HEADER_COLUMN,
      //   toggle_header_row: TABLE_TOGGLE_HEADER_ROW,
      //   toggle_header_cells: TABLE_TOGGLE_HEADER_CELL,
      // },
      {
        delete_table: TABLE_DELETE_TABLE,
      },
    ],
  },
  {
    hr: HR,
    code_block: CODE,
  },
  {
    text_line_spacing: TEXT_LINE_SPACINGS,
  },
  {
    indent_more: INDENT_MORE,
    indent_less: INDENT_LESS,
  },
];

class EditorToolbar extends React.PureComponent<any, any, any> {

  props: {
    editorState: EditorState,
    editorView: ?EditorView,
    onChange?: ?(state: EditorState) => void,
    onReady?: ?(view: EditorView) => void,
  };

  render(): React.Element<any> {
    return (
      <div className="czi-editor-toolbar">
        {CommandGroups.map(this._renderButtonsGroup)}
      </div>
    );
  }

  _renderButtonsGroup = (group: Object, index: number): React.Element<any> => {
    const buttons = Object.keys(group).map(label => {
      const obj = group[label];
      if (obj instanceof UICommand) {
        return this._renderButton(label, obj);
      } else if (Array.isArray(obj)) {
        return this._renderMenuButton(label, obj );
      } else {
        return null;
      }
    }).filter(Boolean);
    return (
      <div key={'g' + String(index)} className="czi-custom-buttons">
        {buttons}
      </div>
    );
  };

  _renderMenuButton = (
    label: string,
    commandGroups: Array<{[string]: UICommand}>,
  ): React.Element<any> => {
    const {editorState, editorView} = this.props;
    return (
      <CommandMenuButton
        commandGroups={commandGroups}
        dispatch={this._dispatchTransaction}
        editorState={editorState || EDITOR_EMPTY_STATE}
        editorView={editorView}
        key={label}
        label={label}
      />
    );
  };

  _renderButton = (label: string, command: UICommand): React.Element<any> => {
    const {editorState, editorView} = this.props;
    return (
      <CommandButton
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

export default EditorToolbar;
