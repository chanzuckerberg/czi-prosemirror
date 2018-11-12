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
    onClick?: ?(val: any, e: SyntheticEvent) => void,
    onMouseEnter?: ?(val: any, e: SyntheticEvent) => void,
    style?: ?Object,
    title?: ?string,
    value?: any,
  };

  _clicked = false;
  _mul = false;
  _pressedTarget = null;
  _unmounted = false;

  state = {pressed: false};

  render(): React.Element<any> {
    const {className, label, disabled, active, id, style, title} = this.props;
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
        onMouseEnter={disabled ? noop : this._onMouseEnter}
        onMouseUp={disabled ? noop : this._onMouseUp}
        role="button"
        style={style}
        tabIndex={0}
        title={title}>
        {label}
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

  _onMouseEnter = (e: SyntheticEvent): void => {
    this._pressedTarget = null;
    e.preventDefault();
    const {onMouseEnter, value} = this.props;
    onMouseEnter && onMouseEnter(value, e);
  };

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
      const {onClick, value} = this.props;
      onClick && onClick(value, e);
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

export default CustomButton;
