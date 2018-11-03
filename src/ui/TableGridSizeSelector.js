// @flow

import Command from '../Command';
import CommandButton from './CommandButton';
import CommandMenuButton from './CommandMenuButton';
import CustomMenuItem from './CustomMenuItem';
import React from 'react';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {TABLE_INSERT_TABLE} from '../configs';
import {Transform} from 'prosemirror-transform';

import './czi-table-grid-size-selector.css';

class TableGridSizeSelector extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    return (
      <div className="czi-table-grid-size-selector">
        TableGridSizeSelecton
      </div>
    );
  }
}

export default TableGridSizeSelector;
