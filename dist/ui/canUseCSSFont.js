'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = canUseCSSFont;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cached = {};

function canUseCSSFont(fontName) {
  var doc = document;

  if (cached.hasOwnProperty(fontName)) {
    return _promise2.default.resolve(cached[fontName]);
  }

  if (!doc.fonts || !doc.fonts.check || !doc.fonts.ready || !doc.fonts.status || !doc.fonts.values) {
    // Feature is not supported, install the CSS anyway
    // https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check#Browser_compatibility
    // TODO: Polyfill this.
    console.warn('FontFaceSet is not supported');
    return _promise2.default.resolve(false);
  }

  return new _promise2.default(function (resolve) {
    // https://stackoverflow.com/questions/5680013/how-to-be-notified-once-a-web-font-has-loaded
    // All fonts in use by visible text have loaded.
    var check = function check() {
      if (doc.fonts.status !== 'loaded') {
        setTimeout(check, 350);
        return;
      }
      // Do not use `doc.fonts.check()` because it may return falsey result.
      var fontFaces = (0, _from2.default)(doc.fonts.values());
      var matched = fontFaces.find(function (ff) {
        return ff.family === fontName;
      });
      var result = !!matched;
      cached[fontName] = result;
      resolve(result);
    };
    doc.fonts.ready.then(check);
  });
}