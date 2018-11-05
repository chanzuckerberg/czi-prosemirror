// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v1';
import PopUpManager from './PopUpManager';
import PopUp from './PopUp';

import type {PopUpParams, PopUpProps, ViewProps} from './PopUp';
import type {PositionHandler} from './PopUpPosition';
import type {Rect} from './rects';

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


function getRootElement(id: string, forceCreation: boolean): ?HTMLElement {
  const root: any = document.body || document.documentElement;
  let element = document.getElementById(id);
  if (!element && forceCreation) {
    element = document.createElement('div');
  }

  if (!element) {
    return null;
  }

  element.style.cssText = `position: fixed; top: 0; left: 0; z-index: 99999`;
  element.id = id;
  // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  if (!element.parentElement) {
    root.appendChild(element);
  }
  return element;
}

function renderPopUp(
  rootId: string,
  close: Function,
  View: Function,
  viewProps: ViewProps,
  popUpParams: PopUpParams,
): void {
  const rootNode = getRootElement(rootId, true);
  if (rootNode) {
    const component = (
      <PopUp
        View={View}
        close={close}
        popUpParams={popUpParams}
        viewProps={viewProps}
      />
    );
    ReactDOM.render(component, rootNode);
  }
}

function unrenderPopUp(rootId: string): void {
  const rootNode = getRootElement(rootId, false);
  if (rootNode) {
    ReactDOM.unmountComponentAtNode(rootNode);
    rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  }
}

export default function createPopUp(
  View: Function,
  viewProps?: ?ViewProps,
  popUpParams?: ?PopUpParams,
): PopUpHandle {
  const rootId = uuid();

  let closed = false;
  let currentViewProps = viewProps;

  viewProps = viewProps || {};
  popUpParams = popUpParams || {};

  const closePopUp = (value) => {
    if (closed) {
      return;
    }
    closed = true;
    unrenderPopUp(rootId);

    const onClose = popUpParams && popUpParams.onClose;
    onClose && onClose(value);
  };

  const render = renderPopUp.bind(null, rootId, closePopUp, View);
  const emptyObj = {};
  render(currentViewProps || emptyObj, popUpParams || emptyObj);

  return {
    close: closePopUp,
    update: (nextViewProps) => {
      currentViewProps = nextViewProps;
      render(currentViewProps || emptyObj, popUpParams || emptyObj);
    },
  };
}
