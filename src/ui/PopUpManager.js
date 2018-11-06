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
  position: PositionHandler,
};

export type PopUpBridge = {
  getDetails: () => PopUpDetails,
};

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
  }

  _unobserve(): void {
    document.removeEventListener('mousemove', this._onMouseChange, false);
    document.removeEventListener('mouseup', this._onMouseChange, false);
    this._rafID && cancelAnimationFrame(this._rafID);
  }

  _onMouseChange = (e: MouseEvent): void => {
    this._mx = e.clientX;
    this._my = e.clientY;
    this._rafID && cancelAnimationFrame(this._rafID);
    this._rafID = requestAnimationFrame(this._syncPosition);
  };

  _syncPosition = (): void => {
    this._rafID = 0;

    const bags = new Map();
    const bridgeToDetails = new Map();
    for (let [bridge, registeredAt] of this._bridges) {
      const details = bridge.getDetails();
      bridgeToDetails.set(bridge, details);
      const {anchor, body} = details;
      if ((body instanceof HTMLElement) && (anchor instanceof HTMLElement)) {
        details.bodyRect = fromHTMlElement(body);
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
      if (!bodyRect || !anchorRect) {
        continue;
      }

      const {x, y} = position(anchorRect, bodyRect);
      const transform = `translate(${x}px, ${y}px)`;

      if (body && this._transforms.get(bridge) !== transform) {
        this._transforms.set(bridge, transform);
        body.style.transform = transform;
        bodyRect.x = x;
        bodyRect.y = y;
      }

      if (
        isIntersected(
          pointer,
          bodyRect,
          40,
        ) ||
        isIntersected(
          pointer,
          anchorRect,
          40,
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
        const {autoDismiss, anchor, body, close} = details;
        if (
          autoDismiss &&
          now - registeredAt > 500 &&
          !hoveredAnchors.has(anchor)
        ) {
          close();
        }
      }
    }
  };
}

export default PopUpManager;
