// @flow

import {fromHTMlElement, fromXY, isIntersected} from './rects';
import {isCollapsed} from './rects';

import type {Rect} from './rects';

import type {PositionHandler} from './PopUpPosition';

export type PopUpDetails = {
  anchor: ?HTMLElement,
  anchorRect?: ?Rect,
  autoDismiss: boolean,
  body: ?HTMLElement,
  bodyRect?: ?Rect,
  close: (val: any) => void,
  modal: boolean,
  position: PositionHandler,
};

export type PopUpBridge = {
  getDetails: () => PopUpDetails,
};

const CLICK_INTERVAL = 800;
const DUMMY_RECT = {x: -10000, y: -10000, w: 0, h: 0};

class PopUpManager {

  _bridges = new Map();
  _transforms = new Map();
  _mx = 0;
  _my = 0;
  _rafID = 0;

  register(bridge: PopUpBridge): void {
    this._bridges.set(bridge, Date.now());
    this._transforms.set(bridge, null);
    if (this._bridges.size === 1) {
      this._observe();
    }
    this._rafID = requestAnimationFrame(this._syncPosition);
  }

  unregister(bridge: PopUpBridge): void {
    this._bridges.delete(bridge);
    this._transforms.delete(bridge);
    if (this._bridges.size === 0) {
      this._unobserve();
    }
    this._rafID && cancelAnimationFrame(this._rafID);
  }

  _observe(): void {
    document.addEventListener('mousemove', this._onMouseChange, false);
    document.addEventListener('mouseup', this._onMouseChange, false);
    document.addEventListener('click', this._onClick, false);
  }

  _unobserve(): void {
    document.removeEventListener('mousemove', this._onMouseChange, false);
    document.removeEventListener('mouseup', this._onMouseChange, false);
    document.removeEventListener('click', this._onClick, false);
    this._rafID && cancelAnimationFrame(this._rafID);
  }

  _onMouseChange = (e: MouseEvent): void => {
    this._mx = e.clientX;
    this._my = e.clientY;
    this._rafID && cancelAnimationFrame(this._rafID);
    this._rafID = requestAnimationFrame(this._syncPosition);
  };

  _onClick = (e: MouseEvent): void => {
    const bridgeToDetails = new Map();
    const now = Date.now();
    let detailsWithModalToDismiss;
    for (let [bridge, registeredAt] of this._bridges) {
      if ((now - registeredAt) > CLICK_INTERVAL) {
        const details = bridge.getDetails();
        if (details.modal && details.autoDismiss) {
          detailsWithModalToDismiss = details;
        }
      }
    }
    if (!detailsWithModalToDismiss) {
      return;
    }
    const {body, close} = detailsWithModalToDismiss;
    const pointer = fromXY(e.clientX, e.clientY, 20);
    const bodyRect = body ? fromHTMlElement(body) : null;
    if (!bodyRect || !isIntersected(pointer, bodyRect)) {
      close();
    }
  };

  _syncPosition = (): void => {
    this._rafID = 0;

    const bags = new Map();
    const bridgeToDetails = new Map();
    for (let [bridge, registeredAt] of this._bridges) {
      const details = bridge.getDetails();
      bridgeToDetails.set(bridge, details);
      const {anchor, body} = details;
      if (body instanceof HTMLElement) {
        details.bodyRect = fromHTMlElement(body);
      }
      if (anchor instanceof HTMLElement) {
        details.anchorRect = fromHTMlElement(anchor);
      }
    }

    const pointer = fromXY(this._mx, this._my, 10);
    const hoveredAnchors = new Set();
    for (let [bridge, details] of bridgeToDetails) {
      const {
        anchor,
        bodyRect,
        anchorRect,
        position,
        body,
        close,
      } = details;
      if (!bodyRect && !anchorRect) {
        continue;
      }

      const {x, y} = position(anchorRect, bodyRect);
      const transform = `translate(${x}px, ${y}px)`;

      if (body && bodyRect && this._transforms.get(bridge) !== transform) {
        this._transforms.set(bridge, transform);
        body.style.transform = transform;
        bodyRect.x = x;
        bodyRect.y = y;
      }

      if (
        isIntersected(
          pointer,
          bodyRect || DUMMY_RECT,
          0,
        ) ||
        isIntersected(
          pointer,
          anchorRect || DUMMY_RECT,
          0,
        )
      ) {
        anchor && hoveredAnchors.add(anchor);
      }
    }

    while (true) {
      const size = hoveredAnchors.size;
      for (let [bridge, details] of bridgeToDetails) {
        const {anchor, body} = details;
        for (let ha of hoveredAnchors) {
          if (
            anchor &&
            body &&
            !hoveredAnchors.has(anchor) &&
            body.contains(ha)
          ) {
            hoveredAnchors.add(anchor);
          }
        }
      }
      if (hoveredAnchors.size === size) {
        break;
      }
    }

    const now = Date.now();
    for (let [bridge, registeredAt] of this._bridges) {
      const details = bridgeToDetails.get(bridge);
      if (details) {
        const {autoDismiss, anchor, body, close, modal} = details;
        if (
          autoDismiss &&
          // Modal is handled separately at `onClick`
          !modal &&
          now - registeredAt > CLICK_INTERVAL &&
          !hoveredAnchors.has(anchor)
        ) {
          close();
        }
      }
    }
  };
}

const instance = new PopUpManager();

export default instance;
