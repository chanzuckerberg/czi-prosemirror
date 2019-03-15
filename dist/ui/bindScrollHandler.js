'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bindScrollHandler;
function bindScrollHandler(target, callback) {
  var defaultView = target.ownerDocument.defaultView;
  var els = [];

  var rid = 0;

  var onScroll = function onScroll() {
    // Debounce the scroll handler.
    rid && cancelAnimationFrame(rid);
    rid = requestAnimationFrame(callback);
  };

  var el = target;

  // Scroll event does not bubble, so we need to look up all the scrollable
  // elements.
  while (el) {
    var overflow = defaultView.getComputedStyle(el).overflow;
    if (onScroll && overflow === 'auto' || overflow === 'scroll') {
      el.addEventListener('scroll', onScroll, false);
      els.push(el);
    }
    el = el.parentElement;
  }

  return {
    dispose: function dispose() {
      while (onScroll && els.length) {
        el = els.pop();
        el && el.removeEventListener('scroll', onScroll, false);
      }
      onScroll = null;
      rid && window.cancelAnimationFrame(rid);
      rid = 0;
    }
  };
}