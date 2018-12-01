// @flow

import './czi-form.css';
import './czi-math-editor.css';
import CustomButton from './CustomButton';
import MathQuillEditor from './mathquill-editor/MathQuillEditor';
import React from 'react';
import cx from 'classnames';
import uuid from './uuid';

class MathEditor extends React.PureComponent<any, any, any> {

  props: {
    initialValue: ?string,
    close: (latex: ?string) => void,
  };

  state = {
    value: this.props.initialValue || '',
  };

  _id = uuid();
  _unmounted = false;

  render(): React.Element<any> {
    const {value} = this.state;
    return (
      <div className="czi-math-editor">
        <form className="czi-form">
          <fieldset>
            <legend>Insert Math</legend>
            <MathQuillEditor
              onChange={this._onChange}
              value={value}
            />
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
            <CustomButton
              active={true}
              disabled={!this.state.value}
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
      </div>
    );
  }

  _onChange = (value: string): void => {
    this.setState({value});
  };

  _cancel = (): void => {
    this.props.close();
  };

  _insert = (): void => {
    this.props.close(this.state.value);
  };
}

export default MathEditor;
