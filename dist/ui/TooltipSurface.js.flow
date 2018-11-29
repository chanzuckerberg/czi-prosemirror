// @flow

import './czi-tooltip-surface.css';
import React from 'react';
import createPopUp from './createPopUp';
import uuid from './uuid';

class TooltipView extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    const {tooltip} = this.props;
    return (
      <div className="czi-tooltip-view">
        {tooltip}
      </div>
    );
  }
}

let activePopUp = null;

class TooltipSurface extends React.PureComponent<any, any, any> {

  _popUp = null;
  _tID = 0;
  _id = uuid();

  props: {
    tooltip: string,
    children?: any,
  };

  componentWillUnmount(): void {
    this._tID && window.clearTimeout(this._tID);
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
        onMouseDown={tooltip && this._onMouseDown}
        role="tooltip">
        {children}
      </span>
    );
  }

  _onMouseEnter = (): void => {
    this._tID && window.clearTimeout(this._tID);
    this._tID = setTimeout(this._show, 500);
  };

  _onMouseDown = (): void => {
    this._tID && window.clearTimeout(this._tID);
    this._hide();
  };

  _onClose = (): void => {
    this._popUp = null;
  };

  _show = (): void => {
    this._tID = 0;
    if (activePopUp && activePopUp !== this._popUp) {
      activePopUp.close();
      activePopUp = null;
    }
    const {tooltip} = this.props;
    if (!this._popUp && tooltip) {
      this._popUp = createPopUp(TooltipView, {tooltip}, {
        anchor: document.getElementById(this._id),
        onClose: this._onClose,
      });
      activePopUp = this._popUp;
    }
  };

  _hide = (): void => {
    if (activePopUp === this._popUp) {
      activePopUp = null;
    }
    this._tID = 0;
    this._popUp && this._popUp.close();
    this._popUp = null;
  };
}

export default TooltipSurface;
