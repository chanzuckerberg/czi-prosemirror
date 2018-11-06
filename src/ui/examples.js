// @flow

import CustomButton from './CustomButton';
import Editor from './Editor';
import React from 'react';
import ReactDOM from 'react-dom';
import TableGridSizeEditor from './TableGridSizeEditor';
import createPopUp from './createPopUp';
import nullthrows from 'nullthrows';
import {atAnchorRight} from './popUpPosition';

class TableGridSizeEditorExample extends React.PureComponent<any, any, any> {
  _popup = null;

  state = {rows: 0, cols: 0};

  render() {
    return (
      <CustomButton
        label={`TableGridSizeEditor = ${JSON.stringify(this.state)}`}
        onClick={this._onClick}
      />
    );
  }

  _onClick = (_, event): void => {
    this._popup = createPopUp(TableGridSizeEditor, null, {
      anchor: event.currentTarget,
      position: atAnchorRight,
      onClose: (value) => {
        value && this.setState(value);
      },
    });
  };
}

class Examples extends React.PureComponent<any, any, any> {
  render() {
    return (
     <div>
       <TableGridSizeEditorExample />
     </div>
    );
  }
}

function main(): void {
  const el = document.createElement('div');
  el.id = 'examples';
  const {body} = document;
  body && body.appendChild(el);
  ReactDOM.render(<Examples />, el);
}

window.onload = main;
