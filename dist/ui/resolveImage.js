'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = resolveImage;

var _isOffline = require('./isOffline');

var _isOffline2 = _interopRequireDefault(_isOffline);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ImageResult', {
  value: require('prop-types').shape({
    complete: require('prop-types').bool.isRequired,
    height: require('prop-types').number.isRequired,
    naturalHeight: require('prop-types').number.isRequired,
    naturalWidth: require('prop-types').number.isRequired,
    src: require('prop-types').string.isRequired,
    width: require('prop-types').number.isRequired
  })
});


var cache = {};
var queue = [];

function resolveImage(src) {
  return new _promise2.default(function (resolve, reject) {
    var bag = { src: src, resolve: resolve, reject: reject };
    queue.push(bag);
    processQueue();
  });
}

function processQueue() {
  var bag = queue.shift();
  if (bag) {
    processPromise(bag.src, bag.resolve, bag.reject);
  }
}

function processPromise(src, resolve, reject) {
  var result = {
    complete: false,
    height: 0,
    naturalHeight: 0,
    naturalWidth: 0,
    src: src || '',
    width: 0
  };

  if ((0, _isOffline2.default)()) {
    resolve(result);
    return;
  }

  var srcStr = src || '';

  if (cache[srcStr]) {
    var cachedResult = (0, _assign2.default)({}, cache[srcStr]);
    resolve(cachedResult);
    return;
  }

  var parsedURL = _url2.default.parse(srcStr);
  var protocol = parsedURL.protocol,
      port = parsedURL.port;

  if (!/(http:|https:)/.test(protocol || '') || port) {
    resolve(result);
    return;
  }

  var img = void 0;

  var onLoad = function onLoad() {
    if (img) {
      result.width = img.width;
      result.height = img.height;
      result.naturalWidth = img.width;
      result.naturalHeight = img.height;
      result.complete = true;
    }
    resolve(result);
    dispose();
    cache[srcStr] = (0, _extends3.default)({}, result);
  };

  var onError = function onError() {
    resolve(result);
    dispose();
  };

  var dispose = function dispose() {
    if (img) {
      if (img instanceof HTMLElement) {
        var pe = img.parentNode;
        pe && pe.removeChild(img);
      }
      img.onload = null;
      img.onerror = null;
      img = null;
    }
    processQueue();
  };

  var _document = document,
      body = _document.body;

  if (body) {
    img = document.createElement('img');
    img.style.cssText = 'position:fixed;left:-10000000000px;width:auto;height:auto;';
    img.onload = onLoad;
    img.onerror = onError;
    img.src = srcStr;
    body.appendChild(img);
  } else {
    img = new Image();
    img.onload = onLoad;
    img.onerror = onError;
    img.src = srcStr;
  }
}