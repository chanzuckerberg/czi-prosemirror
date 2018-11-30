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
let activeID = 0;

class TooltipSurface extends React.PureComponent<any, any, any> {

  _popUp = null;
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
    activeID && window.clearTimeout(activeID);
    activeID = setTimeout(this._show, 500);
  };

  _onMouseDown = (): void => {
    activeID && window.clearTimeout(activeID);
    this._hide();
  };

  _onClose = (): void => {
    this._popUp = null;
  };

  _show = (): void => {
    activeID = 0
    const {tooltip} = this.props;;
    if (activePopUp) {
      if (activePopUp === this._popUp && tooltip) {
        return;
      } else {
        activePopUp.close();
        activePopUp = null;
      }
    }
    if (!this._popUp && tooltip) {
      this._popUp = createPopUp(TooltipView, {tooltip}, {
        anchor: document.getElementById(this._id),
        onClose: this._onClose,
      });
      activePopUp = this._popUp;
    }
  };

  _hide = (): void => {
    activeID = 0;
    if (activePopUp === this._popUp) {
      activePopUp = null;
    }
    this._popUp && this._popUp.close();
    this._popUp = null;
  };
}

export default TooltipSurface;
