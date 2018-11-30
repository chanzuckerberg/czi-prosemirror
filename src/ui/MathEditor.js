// @flow

import './czi-form.css';
import './czi-math-editor.css';
import CustomButton from './CustomButton';
import React from 'react';
import cx from 'classnames';

import type {MathValue} from '../Types';

class MathEditor extends React.PureComponent<any, any, any> {

  props: {
    initialValue: ?MathValue,
    close: (val: ?MathValue) => void,
  };

  state = {
    ...(this.props.initialValue || {}),
  };

  render(): React.Element<any> {
    const {xml} = this.state;
    const className = cx('czi-math-editor');


    return (
      <div className={className}>
        <form className="czi-form">
          <fieldset>
            <legend>Insert Math</legend>

          </fieldset>
          <hr />
          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
            <CustomButton
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
      </div>
    );
  }

  _cancel = (): void => {
    this.props.close();
  };

  _insert = (): void => {
    this.props.close(this.state.value);
  };
}

export default MathEditor;
