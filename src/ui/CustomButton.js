// @flow

import React from 'react';
import cx from 'classnames';

import './czi-custom-button.css';

function noop(e: SyntheticEvent): void {
  e.preventDefault();
}

class CustomButton extends React.PureComponent<any, any, any> {

  props: {
    active?: ?boolean,
    className?: ?string,
    disabled?: ?boolean,
    id?: ?string,
    label: string,
    onClick: (value: any, e: SyntheticEvent) => void,
    value?: any,
  };

  _pressedTarget = null;
  _unmounted = false;

  state = {pressed: false};

  render(): React.Element<any> {
    const {className, label, disabled, active, id} = this.props;
    const {pressed} = this.state;

    const buttonClassName = cx(className, {
      'active': active,
      'czi-custom-button': true,
      'disabled': disabled,
      'pressed': pressed,
    });

    return (
      <span
        aria-pressed={pressed}
        className={buttonClassName}
        id={id}
        onKeyPress={disabled ? noop : this._onMouseUp}
        onMouseDown={disabled ? noop : this._onMouseDown}
        onMouseUp={disabled ? noop : this._onMouseUp}
        role="button"
        tabIndex={0}>
        {label}
      </span>
    );
  }

  componentWillUnmount(): void {
    this._unmounted = true;
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
      onClick(value, e);
    }
    if (!this._unmounted) {
      this.setState({pressed: false});
    }
    this._pressedTarget = null;
  };
}

export default CustomButton;
