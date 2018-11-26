// @flow

import {isCollapsed} from './rects';

import type {Rect} from './rects';

export type PositionHandler = (anchorRect: ?Rect, bodyRect: ?Rect) => Rect;

export function atAnchorBottom(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x;
    rect.y = anchorRect.y + anchorRect.h;
  }

  if (!anchorRect || isCollapsed(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

export function atAnchorBottomCenter(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x - (bodyRect.w - anchorRect.w) / 2;
    rect.y = anchorRect.y + anchorRect.h;
  }

  if (!anchorRect || isCollapsed(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

export function atAnchorRight(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x + anchorRect.w + 1;
    rect.y = anchorRect.y;
  }

  if (!anchorRect || isCollapsed(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

export function atViewportCenter(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (bodyRect) {
    rect.x = (window.innerWidth - bodyRect.w) / 2;
    rect.y = (window.innerHeight - bodyRect.h) / 2;
  }

  if (!bodyRect || isCollapsed(bodyRect)) {
    rect.x = -10000;
  }

  return rect;
}
