// @flow

export type Rect = {
  h: number,
  w: number,
  x: number,
  y: number,
};

export function isCollapsed(rect: Rect): boolean {
  return rect.w === 0 || rect.h === 0;
}

export function isIntersected(r1: Rect, r2: Rect): boolean {
  return !(
    r2.x > (r1.x + r1.w) ||
    (r2.x + r2.w) < r1.x ||
    r2.y > (r1.y + r1.h) ||
    (r2.y + r2.h) < r1.y
  );
}

export function fromXY(x: number, y: number, padding: ?number): Rect {
  padding = padding || 0;
  return {
    x: x - padding,
    y: y - padding,
    w: padding * 2,
    h: padding * 2,
  };
}

export function fromHTMlElement(el: HTMLElement): Rect {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height,
  };
}
