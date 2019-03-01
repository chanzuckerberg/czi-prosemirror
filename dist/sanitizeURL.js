'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitizeURL;
var HTTP_PREFIX = /^http(s?):*\/\//i;

function sanitizeURL(url) {
  if (!url) {
    return 'http://';
  }
  if (HTTP_PREFIX.test(url)) {
    return url;
  }
  return 'http://' + url;
}