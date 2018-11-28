// @flow

import React from 'react';
import cx from 'classnames';
import uuid from './uuid';

import './czi-custom-radio-button.css';

function noop(e: SyntheticEvent): void {
  e.preventDefault();
}

class CustomRadioButton extends React.PureComponent<any, any, any> {

  props: {
    checked?: ?boolean,
    className?: ?string,
    disabled?: ?boolean,
    inline?: ?boolean,
    label?: string | React.Element<any> | null,
    name?: ?string,
    onSelect?: ?(val: any, e: SyntheticEvent) => void,
    value?: any,
  };

  _clicked = false;
  _mul = false;
  _pressedTarget = null;
  _unmounted = false;
  _name = uuid();

  state = {pressed: false};

  render(): React.Element<any> {
    const {
      className, disabled, checked, label, inline, name,
    } = this.props;

    const {pressed} = this.state;

    const buttonClassName = cx(className, {
      'checked': checked,
      'czi-custom-radio-button': true,
      'disabled': disabled,
      'inline': inline,
    });

    return (
      <span
        className={buttonClassName}
        onKeyPress={disabled ? noop : this._onMouseUp}
        onMouseDown={disabled ? noop : this._onMouseDown}
        onMouseUp={disabled ? noop : this._onMouseUp}>
        <input
          checked={checked}
          className="czi-custom-radio-button-input"
          disabled={disabled}
          name={name || this._name}
          tabIndex={disabled ? null : 0}
          type="radio"
          onChange={noop}
        />
        <span className="czi-custom-radio-button-icon" />
        <span className="czi-custom-radio-button-label">
          {label}
        </span>
      </span>
    );
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    if (this._mul) {
      this._mul = false;
      document.removeEventListener('mouseup', this._onMouseUpCapture, true);
    }
  }

  _onMouseDown = (e: SyntheticEvent): void => {
    e.preventDefault();

    this._pressedTarget = null;
    this._clicked = false;

    if (e.which === 3 || e.button == 2) {
      // right click.
      return;
    }

    this.setState({pressed: true});
    this._pressedTarget = e.currentTarget;
    this._clicked = false;

    if (!this._mul) {
      document.addEventListener('mouseup', this._onMouseUpCapture, true);
      this._mul = true;
    }
  };

  _onMouseUp = (e: SyntheticEvent): void => {
    e.preventDefault();

    this.setState({pressed: false});

    if (this._clicked || e.type === 'keypress') {
      const {onSelect, value, disabled, checked} = this.props;
      !disabled && !checked && onSelect && onSelect(value, e);
    }

    this._pressedTarget = null;
    this._clicked = false;
  };

  _onMouseUpCapture = (e: MouseEvent): void => {
    if (this._mul) {
      this._mul = false;
      document.removeEventListener('mouseup', this._onMouseUpCapture, true);
    }
    const target = e.target;
    this._clicked =
      this._pressedTarget instanceof HTMLElement &&
      target instanceof HTMLElement && (
        target === this._pressedTarget ||
        target.contains(this._pressedTarget) ||
        this._pressedTarget.contains(target)
      );
  }
}

export default CustomRadioButton;
