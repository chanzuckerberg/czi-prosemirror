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

let activeID = 0;
let activePopUp = null;
let activeView = null;
let activeX = 0;
let activeY = 0;
let mountedCount = 0;
let movedCount = 0;

function onMouseMove(e: MouseEvent): void {
  if (activeID) {
    activeX = activeX || e.clientX;
    activeY = activeY || e.clientY;
    const dy = activeY - e.clientY;
    const dx = activeX - e.clientX;
    const dd = 10 * 10;
    if ((dx * dx) > dd || (dy * dy) > dd) {
      activePopUp && activePopUp.close();
      clearTimeout(activeID);
    }
  }
}

class TooltipSurface extends React.PureComponent<any, any, any> {

  _id = uuid();

  props: {
    tooltip: string,
    children?: any,
  };

  componentDidMount(): void {
    mountedCount++;
    if (mountedCount === 1) {
      document.addEventListener('mousemove', onMouseMove, true);
    }
  }

  componentWillUnmount(): void {
    this._hide();
    mountedCount--;
    if (mountedCount === 0) {
      document.removeEventListener('mousemove', onMouseMove, true);
    }
    if (activeView === this) {
      activePopUp && activePopUp.close();
      activeID && clearTimeout(activeID);
    }
  }

  render(): React.Element<any> {
    const {tooltip, children} = this.props;
    return (
      <span
        aria-label={tooltip}
        className="czi-tooltip-surface"
        data-tooltip={tooltip}
        id={this._id}
        onMouseMove={tooltip && this._onMouseMove}
        onMouseDown={tooltip && this._onMouseDown}
        role="tooltip">
        {children}
      </span>
    );
  }

  _onMouseMove = (e: SyntheticMouseEvent): void => {
    if (activeView === this && activePopUp) {
      return;
    }
    activePopUp && activePopUp.close();
    activeID && window.clearTimeout(activeID);
    activeID = setTimeout(this._show, 350);
    activeView = this;
  };

  _onMouseDown = (): void => {
    activeID && window.clearTimeout(activeID);
    this._hide();
  };

  _onClose = (): void => {
    activeID = null;
    activePopUp = null;
    activeX = 0;
    activeY = 0;
    activeView = null;
  };

  _show = (): void => {
    activePopUp && activePopUp.close();
    activePopUp = null;
    const {tooltip} = this.props;
    if (tooltip) {
      activePopUp = createPopUp(TooltipView, {tooltip}, {
        anchor: document.getElementById(this._id),
        onClose: this._onClose,
      });
    }
  };

  _hide = (): void => {
    activePopUp && activePopUp.close();
  };
}

export default TooltipSurface;
