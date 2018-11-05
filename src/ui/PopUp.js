// @flow

import PopUpManager from './PopUpManager';
import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v1';
import {atAnchorBottom} from './popUpPosition';

import type {Rect} from './rects';
import type {PopUpDetails} from './PopUpManager';

type PositionHandler = (anchorRect: ?Rect, bodyRect: ?Rect) => Rect;

export type ViewProps = Object;

export type PopUpParams = {
  anchor?: any,
  autoDismiss?: ?boolean,
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

// function isInRect(mx: number, my: number, rect: Rect): boolean {
//   const padding = 40;
//   return (
//     (rect.w > 0) &&
//     (rect.h > 0) &&
//     (mx >= (rect.x - padding)) &&
//     (mx <= (rect.x + rect.w + padding)) &&
//     (my >= (rect.y - padding)) &&
//     (my <= (rect.y + rect.h + padding ))
//   );
// }




let popUpManager = null;

class PopUp extends React.PureComponent {

  props: PopUpProps;

  _bridge = null;
  _id = uuid();
  _rafId = NaN;
  _transform = '';

  render(): React.Element<any> {
    const dummy = {};
    const {View, viewProps, close, popUpParams} = this.props;
    const {autoDismiss, position, anchor} = (popUpParams || dummy);
    return (
      <div data-pop-up-id={this._id} id={this._id}>
        <View
          {...(viewProps || dummy)}
          close={close}
        />
      </div>
    );
  }

  componentDidMount(): void {
    popUpManager = popUpManager || new PopUpManager();
    this._bridge = {getDetails: this._getDetails};
    popUpManager.register(this._bridge);
  }

  componentWillUnmount(): void {
    popUpManager && this._bridge && popUpManager.unregister(this._bridge);
  }

  _getDetails = (): PopUpDetails => {
    const {close, viewProps, popUpParams} = this.props;
    const {anchor, autoDismiss, position} = popUpParams;
    return {
      anchor,
      autoDismiss: autoDismiss === false ? false : true,
      body: document.getElementById(this._id),
      close,
      position: position || atAnchorBottom,
    };
  };
}

export default PopUp;
