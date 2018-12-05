// @flow

import './czi-tooltip-surface.css';
import './czi-animations.css';

import React from 'react';
import createPopUp from './createPopUp';
import uuid from './uuid';

class TooltipView extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    const {tooltip} = this.props;
    return (
      <div className="czi-tooltip-view czi-animation-fade-in">
        {tooltip}
      </div>
    );
  }
}

class TooltipSurface extends React.PureComponent<any, any, any> {

  _id = uuid();
  _popUp = null;

  props: {
    tooltip: string,
    children?: any,
  };

  componentWillUnmount(): void {
    this._popUp && this._popUp.close();
  }

  render(): React.Element<any> {
    const {tooltip, children} = this.props;
    return (
      <span
        aria-label={tooltip}
        className="czi-tooltip-surface"
        data-tooltip={tooltip}
        id={this._id}
        onMouseEnter={tooltip && this._onMouseEnter}
        onMouseLeave={tooltip && this._onMouseLeave}
        onMouseDown={tooltip && this._onMouseLeave}
        role="tooltip">
        {children}
      </span>
    );
  }

  _onMouseEnter = (): void => {
    if (!this._popUp) {
      const {tooltip} = this.props;
      this._popUp = createPopUp(TooltipView, {tooltip}, {
        anchor: document.getElementById(this._id),
        onClose: this._onClose,
      });
    }
  };

  _onMouseLeave = (): void => {
    this._popUp && this._popUp.close();
    this._popUp = null;
  };

  _onClose = (): void => {
    this._popUp = null;
  };
}

export default TooltipSurface;
