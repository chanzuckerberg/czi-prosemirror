'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransparent = isTransparent;
exports.toCSSColor = toCSSColor;

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RGBA_PATTERN = /^rgba/i;

var RGBA_TRANSPARENT = 'rgba(0,0,0,0)';

var ColorMaping = {
  transparent: RGBA_TRANSPARENT,
  inherit: ''
};

function isTransparent(source) {
  if (!source) {
    return true;
  }
  var hex = toCSSColor(source);
  return !hex || hex === RGBA_TRANSPARENT;
}

function toCSSColor(source) {
  if (!source) {
    return '';
  }
  if (source in ColorMaping) {
    return ColorMaping[source];
  }

  if (source && RGBA_PATTERN.test(source)) {
    var color = (0, _color2.default)(source);
    if (color.valpha === 0) {
      ColorMaping[source] = RGBA_TRANSPARENT;
      return RGBA_TRANSPARENT;
    }
    var rgba = color.toString();
    ColorMaping[source] = rgba.toString();
    return rgba;
  }

  var hex = '';
  try {
    hex = (0, _color2.default)(source).hex().toLowerCase();
    ColorMaping[source] = hex;
  } catch (ex) {
    console.warn('unable to convert to hex', source);
    ColorMaping[source] = '';
  }
  return hex;
}

exports.default = toCSSColor;