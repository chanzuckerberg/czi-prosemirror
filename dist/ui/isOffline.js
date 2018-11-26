'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isOffline;
function isOffline() {
  if (window.navigator.hasOwnProperty('onLine')) {
    return !window.navigator.onLine;
  }
  return false;
}