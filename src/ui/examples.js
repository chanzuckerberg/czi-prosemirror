// @flow

import ColorEditor from './ColorEditor';
import CustomButton from './CustomButton';
import Editor from './Editor';
import React from 'react';
import ReactDOM from 'react-dom';
import TableGridSizeEditor from './TableGridSizeEditor';
import createPopUp from './createPopUp';
import nullthrows from 'nullthrows';
import uuid from 'uuid/v1';
import {atAnchorRight} from './popUpPosition';

class TableGridSizeEditorExample extends React.PureComponent<any, any, any> {

  _popup = null;
  _id = uuid();

  state = {rows: 0, cols: 0};

  render() {
    return (
      <CustomButton
        id={this._id}
        label={`TableGridSizeEditor = ${JSON.stringify(this.state)}`}
        onClick={this._onClick}
      />
    );
  }

  _onClick = (_, event): void => {
    if (!this._popup) {
      this._popup = createPopUp(TableGridSizeEditor, null, {
        anchor: document.getElementById(this._id),
        onClose: (value) => {
          value && this.setState(value);
          this._popup = null;
        },
      });
    }
  };
}

class ColorEditorExample extends React.PureComponent<any, any, any> {

  _popup = null;
  _id = uuid();

  state = {hex: null};

  render() {
    const {hex} = this.state;
    const style = {backgroundColor: hex || 'transparent'}
    return (
      <CustomButton
        id={this._id}
        label={`ColorEditor = ${JSON.stringify(this.state)}`}
        onClick={this._onClick}
        style={style}
      />
    );
  }

  _onClick = (_, event): void => {
    if (!this._popup) {
      this._popup = createPopUp(ColorEditor, this.state, {
        anchor: document.getElementById(this._id),
        onClose: (value) => {
          value && this.setState(value);
          this._popup = null;
        },
      });
    }
  };
}


class Examples extends React.PureComponent<any, any, any> {
  render() {
    return (
     <div>
       <TableGridSizeEditorExample />
       <ColorEditorExample />
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
