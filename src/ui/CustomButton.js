// @flow

import React from 'react';
import cx from 'classnames';

import './CustomButton.css';

class CustomButton extends React.PureComponent<any, any, any> {

  props: {
    active?: ?boolean,
    disabled?: ?boolean,
    label: string,
    onClick: (value: any) => void,
    value?: any,
  };

  _pressedTarget = null;

  state = {pressed: false};

  render(): React.Element<any> {
    const {label, disabled, active} = this.props;
    const {pressed} = this.state;

    const className = cx({
      'active': active,
      'czi-custom-button': true,
      'disabled': disabled,
      'pressed': pressed,
    });

    return (
      <span
        aria-pressed={pressed}
        className={className}
        onKeyPress={disabled ? null : this._onMouseUp}
        onMouseDown={disabled ? null : this._onMouseDown}
        onMouseUp={disabled ? null : this._onMouseUp}
        role="button"
        tabIndex={0}>
        {label}
      </span>
    );
  }

  _onMouseDown = (e: SyntheticEvent): void => {
    e.preventDefault();
    this.setState({pressed: true});
    this._pressedTarget = e.currentTarget;
  };

  _onMouseUp = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (e.currentTarget === this._pressedTarget || e.type === 'keypress') {
      const {onClick, value} = this.props;
      onClick(value);
    }
    this.setState({pressed: false});
    this._pressedTarget = null;
  };
}

export default CustomButton;
