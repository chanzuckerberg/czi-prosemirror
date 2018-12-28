// @flow

export default function throttle(
  fn: Function,
  threshhold: number,
  context: any,
): Function {
  let last;
  let deferTimer = 0;
  const boundFn = fn.bind(context);

  return function () {
    const now = Date.now();
    const args = Array.prototype.slice.call(arguments);
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(
        () => {
          last = now;
          boundFn.apply(null, args);
        },
        threshhold,
      );
    } else {
      last = now;
      boundFn.apply(null, args);
    }
  };
}