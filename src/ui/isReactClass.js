// @flow

export default function isReactClass(maybe: any): boolean {
  if (typeof maybe !== 'function') {
    return false;
  }
  const proto = maybe.prototype;
  if (!proto) {
    return false;
  }
  return !!proto.isReactComponent;
}
