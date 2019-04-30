// @flow

import React from 'react';

import PopUpManager from './PopUpManager';
import {atAnchorBottomLeft, atViewportCenter} from './PopUpPosition';
import uuid from './uuid';

import type {PopUpDetails} from './PopUpManager';
import type {Rect} from './rects';

type PositionHandler = (anchorRect: ?Rect, bodyRect: ?Rect) => Rect;

export type ViewProps = Object;

export type PopUpParams = {
  anchor?: any,
  autoDismiss?: ?boolean,
  container?: ?Element,
  modal?: ?boolean,
  onClose?: ?(val: any) => void,
  position?: ?PositionHandler,
};

export type PopUpProps = {
  View: Function,
  close: Function,
  popUpParams: PopUpParams,
  viewProps: Object,
};

export type PopUpHandle = {
  close: (val: any) => void,
  update: (props: Object) => void,
};

class PopUp extends React.PureComponent {
  props: PopUpProps;

  _bridge = null;
  _id = uuid();

  render(): React.Element<any> {
    const dummy = {};
    const {View, viewProps, close} = this.props;
    return (
      <div data-pop-up-id={this._id} id={this._id}>
        <View {...viewProps || dummy} close={close} />
      </div>
    );
  }

  componentDidMount(): void {
    this._bridge = {getDetails: this._getDetails};
    PopUpManager.register(this._bridge);
  }

  componentWillUnmount(): void {
    this._bridge && PopUpManager.unregister(this._bridge);
  }

  _getDetails = (): PopUpDetails => {
    const {close, popUpParams} = this.props;
    const {anchor, autoDismiss, position, modal} = popUpParams;
    return {
      anchor,
      autoDismiss: autoDismiss === false ? false : true,
      body: document.getElementById(this._id),
      close,
      modal: modal === true,
      position: position || (modal ? atViewportCenter : atAnchorBottomLeft),
    };
  };
}

export default PopUp;
