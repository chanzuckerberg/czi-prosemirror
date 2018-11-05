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
