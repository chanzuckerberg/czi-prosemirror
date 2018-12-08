'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.observe = observe;
exports.unobserve = unobserve;

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// flow type copied from
// https://github.com/que-etc/resize-observer-polyfill/blob/master/src/index.js.flow

// Lightweight utilities to make observing resize of DOM element easier
// with `ResizeObserver`.
// See https://developers.google.com/web/updates/2016/10/resizeobserver
// Usage:
//   `ResizeObserver.observe(element, (entry) => console.log(entry))`
//   `ResizeObserver.unobserve(element)`

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry', {
  value: require('prop-types').shape({
    target: require('prop-types').any.isRequired,
    contentRect: require('prop-types').shape({
      x: require('prop-types').number.isRequired,
      y: require('prop-types').number.isRequired,
      width: require('prop-types').number.isRequired,
      height: require('prop-types').number.isRequired,
      top: require('prop-types').number.isRequired,
      right: require('prop-types').number.isRequired,
      bottom: require('prop-types').number.isRequired,
      left: require('prop-types').number.isRequired
    }).isRequired
  })
});


var instance = null;

var nodesObserving = new _map2.default();

function onResizeObserve(entries) {
  entries.forEach(handleResizeObserverEntry);
}

function handleResizeObserverEntry(entry) {
  var node = entry.target;
  var callbacks = nodesObserving.get(node);
  var executeCallback = function executeCallback(cb) {
    return cb(entry);
  };
  callbacks && callbacks.forEach(executeCallback);
}

function observe(node, callback) {
  var el = node;
  var observer = instance || (instance = new _resizeObserverPolyfill2.default(onResizeObserve));
  if (nodesObserving.has(el)) {
    // Already observing node.
    var callbacks = (0, _nullthrows2.default)(nodesObserving.get(el));
    callbacks.push(callback);
  } else {
    var _callbacks = [callback];
    nodesObserving.set(el, _callbacks);
    observer.observe(el);
  }
}

function unobserve(node, callback) {
  var observer = instance;
  if (!observer) {
    return;
  }
  var el = node;
  observer.unobserve(el);

  if (callback) {
    // Remove the passed in callback from the callbacks of the observed node
    // And, if no more callbacks then stop observing the node
    var callbacks = nodesObserving.has(el) ? (0, _nullthrows2.default)(nodesObserving.get(el)).filter(function (cb) {
      return cb !== callback;
    }) : null;
    if (callbacks && callbacks.length) {
      nodesObserving.set(el, callbacks);
    } else {
      nodesObserving.delete(el);
    }
  } else {
    // Delete all callbacks for the node.
    nodesObserving.delete(el);
  }

  if (!nodesObserving.size) {
    // We have nothing to observe. Stop observing, which stops the
    // ResizeObserver instance from receiving notifications of
    // DOM resizing. Until the observe() method is used again.
    // According to specification a ResizeObserver is deleted by the garbage
    // collector if the target element is deleted.
    observer.disconnect();
    instance = null;
  }
}

exports.default = {
  observe: observe,
  unobserve: unobserve
};