// @flow

import CustomButton from './CustomButton';
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
        <CustomButton
          label="TableGridSizeSelecton"
          onClick={() => {
            this.props.onClose(123);
          }}
        />
      </div>
    );
  }
}

export default TableGridSizeSelector;
