// @flow

import ColorEditor from '../src/ui/ColorEditor';
import CustomButton from '../src/ui/CustomButton';
import Editor from '../src/ui/Editor';
import ImageURLEditor from '../src/ui/ImageURLEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import TableGridSizeEditor from '../src/ui/TableGridSizeEditor';
import createPopUp from '../src/ui/createPopUp';
import nullthrows from 'nullthrows';
import uuid from '../src/ui/uuid';
import {atAnchorRight} from '../src/ui/PopUpPosition';

class TableGridSizeEditorExample extends React.PureComponent<any, any, any> {

  _popup = null;
  _id = uuid();

  state = {rows: 0, cols: 0};

  render() {
    return (
      <div>
        <CustomButton
          id={this._id}
          label="TableGridSizeEditor"
          onClick={this._onClick}
        />
        <pre>
          {JSON.stringify(this.state)}
        </pre>
      </div>
    );
  }

  _onClick = (): void => {
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
      <div>
        <CustomButton
          id={this._id}
          label="ColorEditor"
          onClick={this._onClick}
          style={style}
        />
        <pre>
          {JSON.stringify(this.state)}
        </pre>
      </div>
    );
  }

  _onClick = (): void => {
    if (!this._popup) {
      this._popup = createPopUp(ColorEditor, this.state, {
        anchor: document.getElementById(this._id),
        onClose: (hex) => {
          hex && this.setState({hex});
          this._popup = null;
        },
      });
    }
  };
}

class ImageURLEditorExample extends React.PureComponent<any, any, any> {

  _popup = null;
  _id = uuid();

  state = {
    height: null,
    src: null,
    width: null,
  };

  render() {
    return (
      <div>
        <CustomButton
          id={this._id}
          label="ImageURLEditor"
          onClick={this._onClick}
        />
        <pre>
          {JSON.stringify(this.state)}
        </pre>
      </div>
    );
  }

  _onClick = (): void => {
    if (!this._popup) {
      this._popup = createPopUp(ImageURLEditor, this.state, {
        autoDismiss: false,
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
       <hr />
       <ColorEditorExample />
       <hr />
       <ImageURLEditorExample />
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
