// @flow

export default function lookUpElement(
  el: ?Element,
  predict: (el: Element) => boolean,
): ?Element {

  while (el && el.nodeName) {
    if (predict(el)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}