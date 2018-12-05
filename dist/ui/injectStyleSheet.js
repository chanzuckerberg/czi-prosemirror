'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.default = injectStyleSheet;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addedElements = new _map2.default();

function createElement(tag, attrs) {
  var el = document.createElement(tag);
  (0, _keys2.default)(attrs).forEach(function (key) {
    if (key === 'className') {
      el[key] = attrs[key];
    } else {
      el.setAttribute(key, attrs[key]);
    }
  });
  return el;
}

function injectStyleSheet(urlStr) {
  var parsedURL = _url2.default.parse(urlStr);
  var protocol = parsedURL.protocol;

  var protocolPattern = /^(http:|https:)/;
  var useHTTP = protocolPattern.test(protocol || '');
  if (!protocolPattern.test(protocol || '')) {
    if (protocolPattern.test(window.location.protocol)) {
      parsedURL.protocol = window.location.protocol;
    } else {
      parsedURL.protocol = 'http:';
    }
  }
  var href = _url2.default.format(parsedURL);
  if (addedElements.has(href)) {
    return;
  }
  var el = createElement('link', {
    crossorigin: 'anonymous',
    href: href,
    rel: 'stylesheet'
  });
  addedElements.set(href, el);
  var root = document.head || document.documentElement || document.body;
  root && root.appendChild(el);
}