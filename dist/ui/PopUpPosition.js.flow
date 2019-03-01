// @flow

import {isCollapsed} from './rects';

import type {Rect} from './rects';

export type PositionHandler = (anchorRect: ?Rect, bodyRect: ?Rect) => Rect;

export function atAnchorBottom(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x;
    rect.y = anchorRect.y + anchorRect.h;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if ((rect.x + bodyRect.w) > viewportWidth) {
      rect.x = anchorRect.x - bodyRect.w +  anchorRect.w;
    }
    if ((rect.y + bodyRect.h) > viewportHeight) {
      rect.y = Math.max(anchorRect.y - bodyRect.h, 2);
    }
  }

  if (!anchorRect || isCollapsed(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

export function atAnchorBottomCenter(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (anchorRect && bodyRect) {
    rect.x = Math.max(
      anchorRect.x - (bodyRect.w - anchorRect.w) / 2,
      10,
    );
    rect.y = anchorRect.y + anchorRect.h;
  }

  if (!anchorRect || isCollapsed(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

export function atAnchorBottomLeft(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
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
    const viewportWidth = window.innerWidth;
     if ((rect.x + bodyRect.w) > viewportWidth) {
      rect.x = Math.max(2, anchorRect.x - bodyRect.w);
    }
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

export function atAnchorTopRight(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x + anchorRect.w + 1 - bodyRect.w;
    rect.y = anchorRect.y;
  }

  if (!anchorRect || isCollapsed(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

export function atAnchorTopCenter(anchorRect: ?Rect, bodyRect: ?Rect): Rect {
  const rect = {x: 0, y: 0, w: 0, h: 0};
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x + (anchorRect.w - bodyRect.w) / 2;
    rect.y = anchorRect.y;
  }

  if (!anchorRect || isCollapsed(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}