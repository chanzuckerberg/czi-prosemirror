// @flow

import {EditorState} from 'prosemirror-state';
import React from 'react';
import ReactDOM from 'react-dom';

import ColorEditor from '../src/ui/ColorEditor';
import CustomButton from '../src/ui/CustomButton';
import CustomRadioButton from '../src/ui/CustomRadioButton';
import ImageURLEditor from '../src/ui/ImageURLEditor';
import MathEditor from '../src/ui/MathEditor';
import TableGridSizeEditor from '../src/ui/TableGridSizeEditor';
import createPopUp from '../src/ui/createPopUp';
import renderLaTeXAsHTML from '../src/ui/renderLaTeXAsHTML';
import uuid from '../src/ui/uuid';
import SimpleEditor from './SimpleEditor';

class SimpleEditorExample extends React.PureComponent<any, any, any> {
  state = {
    editorState: SimpleEditor.convertFromHTML(`
       <b>simple editor example</b>
       <p>type something here</p>
    `),
  };

  render() {
    return (
      <SimpleEditor
        editorState={this.state.editorState}
        onChange={this._onChange}
      />
    );
  }

  _onChange = (editorState: EditorState): void => {
    this.setState({editorState});
  };
}

class MathEditorExample extends React.PureComponent<any, any, any> {
  _popup = null;

  state = {
    latex: ' \\displaystyle\\sum_{ 1  }^{ 2  } \\left(3 \\right)   ',
  };

  render() {
    const html = renderLaTeXAsHTML(this.state.latex);
    return (
      <div>
        <CustomButton label="MathEditorExample" onClick={this._onClick} />
        <pre>{JSON.stringify(this.state)}</pre>
        <span dangerouslySetInnerHTML={{__html: html}} />
      </div>
    );
  }

  _onClick = (): void => {
    if (!this._popup) {
      this._popup = createPopUp(
        MathEditor,
        {initialValue: this.state.latex},
        {
          onClose: latex => {
            latex && this.setState({latex});
            this._popup = null;
          },
        }
      );
    }
  };
}
class CustomRadioButtonExample extends React.PureComponent<any, any, any> {
  state = {
    value: '',
  };
  render() {
    const options = ['aaa', 'bbb'].map(value => (
      <CustomRadioButton
        checked={value === this.state.value}
        key={value}
        label={value}
        onSelect={this._onSelect}
        value={value}
      />
    ));
    return (
      <div>
        {options}
        <br />
        value = {this.state.value}
      </div>
    );
  }

  _onSelect = (value: string): void => {
    this.setState({value});
  };
}

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
        <pre>{JSON.stringify(this.state)}</pre>
      </div>
    );
  }

  _onClick = (): void => {
    if (!this._popup) {
      this._popup = createPopUp(TableGridSizeEditor, null, {
        anchor: document.getElementById(this._id),
        onClose: value => {
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
    const style = {backgroundColor: hex || 'transparent'};
    return (
      <div>
        <CustomButton
          id={this._id}
          label="ColorEditor"
          onClick={this._onClick}
          style={style}
        />
        <pre>{JSON.stringify(this.state)}</pre>
      </div>
    );
  }

  _onClick = (): void => {
    if (!this._popup) {
      this._popup = createPopUp(ColorEditor, this.state, {
        anchor: document.getElementById(this._id),
        onClose: hex => {
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
        <pre>{JSON.stringify(this.state)}</pre>
      </div>
    );
  }

  _onClick = (): void => {
    if (!this._popup) {
      this._popup = createPopUp(ImageURLEditor, this.state, {
        autoDismiss: false,
        anchor: document.getElementById(this._id),
        onClose: value => {
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
        <SimpleEditorExample />
        <hr />
        <MathEditorExample />
        <hr />
        <TableGridSizeEditorExample />
        <hr />
        <ColorEditorExample />
        <hr />
        <ImageURLEditorExample />
        <hr />
        <CustomRadioButtonExample />
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
