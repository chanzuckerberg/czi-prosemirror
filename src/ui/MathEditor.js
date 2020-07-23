// @flow

import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from './CustomButton';
import MathQuillEditor from './mathquill-editor/MathQuillEditor';
import preventEventDefault from './preventEventDefault';
import uuid from './uuid';

import './czi-form.css';

type Props = {
  initialValue: ?string,
  close: (latex: ?string) => void,
};

class MathEditor extends React.PureComponent<any, any, any> {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  static propsTypes = {
    initialValue: PropTypes.string,
	close: function(props, propName, componentName) {
        var fn = props[propName];
        if(!fn.prototype ||
           (typeof fn.prototype.constructor !== 'function' &&
            fn.prototype.constructor.length !== 1)) {
            return new Error(propName + 'must be a function with 1 arg of type string');
        }
    }
  }

  state = {
    initialValue: this.props.initialValue,
    value: this.props.initialValue || '',
  };

  _id = uuid();
  _unmounted = false;

  render(): React.Element<any> {
    const {initialValue, value} = this.state;
    return (
      <div className="czi-math-editor">
        <form className="czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>Insert Math</legend>
              <MathQuillEditor onChange={this._onChange} value={value} />
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton label="Cancel" onClick={this._cancel} />
            <CustomButton
              active={true}
              disabled={!this.state.value}
              label={initialValue ? 'Update' : 'Insert'}
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
