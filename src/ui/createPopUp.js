// @flow

import './czi-pop-up.css';
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

let modalsCount = 0;
let popUpsCount = 0;

const Z_INDEX_BASE = 9999;
const MODAL_MASK_ID = 'pop-up-modal-mask-' + uuid();

function showModalMask(): void {
  const root: any = document.body || document.documentElement;
  let element = document.getElementById(MODAL_MASK_ID);
  if (!element) {
    element = document.createElement('div');
    element.id = MODAL_MASK_ID;
    element.className = 'czi-pop-up-modal-mask';
    element.setAttribute('data-mask-type', 'czi-pop-up-modal-mask');
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
  }

  if (root && !element.parentElement) {
    root.appendChild(element);
  }
  const style: any = element.style;
  style.zIndex = (Z_INDEX_BASE + popUpsCount * 3) - 1;
}

function hideModalMask(): void {
  const element = document.getElementById(MODAL_MASK_ID);
  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
}

function getRootElement(id: string, forceCreation: boolean): ?HTMLElement {
  const root: any = document.body || document.documentElement;
  let element = document.getElementById(id);
  if (!element && forceCreation) {
    element = document.createElement('div');
  }

  if (!element) {
    return null;
  }

  element.className = 'czi-pop-up-element';
  element.id = id;

  const style: any = element.style;
  style.zIndex = (Z_INDEX_BASE + popUpsCount * 3);

  // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  if (root && !element.parentElement) {
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

  if (modalsCount > 0) {
    showModalMask();
  } else {
    hideModalMask();
  }
}

function unrenderPopUp(rootId: string): void {
  const rootNode = getRootElement(rootId, false);
  if (rootNode) {
    ReactDOM.unmountComponentAtNode(rootNode);
    rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  }

  if (modalsCount === 0) {
    hideModalMask();
  };
}

export default function createPopUp(
  View: Function,
  viewProps?: ?ViewProps,
  popUpParams?: ?PopUpParams,
): PopUpHandle {
  const rootId = uuid();

  let handle = null;
  let currentViewProps = viewProps;

  viewProps = viewProps || {};
  popUpParams = popUpParams || {};

  const modal = popUpParams.modal || !popUpParams.anchor;
  popUpParams.modal = modal;

  popUpsCount++;
  if (modal) {
    modalsCount++;
  }

  const closePopUp = (value) => {
    if (!handle) {
      return;
    }

    if (modal) {
      modalsCount--;
    }
    popUpsCount--;

    handle = null;
    unrenderPopUp(rootId);

    const onClose = popUpParams && popUpParams.onClose;
    onClose && onClose(value);
  };

  const render = renderPopUp.bind(null, rootId, closePopUp, View);
  const emptyObj = {};

  handle = {
    close: closePopUp,
    update: (nextViewProps) => {
      currentViewProps = nextViewProps;
      render(currentViewProps || emptyObj, popUpParams || emptyObj);
    },
  };

  render(currentViewProps || emptyObj, popUpParams || emptyObj);
  return handle;
}
