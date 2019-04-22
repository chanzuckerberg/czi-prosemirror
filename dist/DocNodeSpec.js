'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATTRIBUTE_LAYOUT = exports.LAYOUT = undefined;
exports.getAttrs = getAttrs;

var _convertToCSSPTValue = require('./convertToCSSPTValue');

var _convertToCSSPTValue2 = _interopRequireDefault(_convertToCSSPTValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LAYOUT = exports.LAYOUT = {
  DESKTOP_SCREEN_4_3: 'desktop_screen_4_3',
  DESKTOP_SCREEN_16_9: 'desktop_screen_16_9',
  US_LETTER_LANDSCAPE: 'us_letter_landscape',
  US_LETTER_PORTRAIT: 'us_letter_portrait'
};

var ATTRIBUTE_LAYOUT = exports.ATTRIBUTE_LAYOUT = 'data-layout';

function getAttrs(el) {
  var attrs = {
    layout: null,
    width: null,
    padding: null
  };

  var _ref = el.style || {},
      width = _ref.width,
      maxWidth = _ref.maxWidth,
      padding = _ref.padding;

  var ww = (0, _convertToCSSPTValue2.default)(width) || (0, _convertToCSSPTValue2.default)(maxWidth);
  var pp = (0, _convertToCSSPTValue2.default)(padding);
  if (ww) {
    // 1pt = 1/72in
    // letter size: 8.5in x 11inch
    var ptWidth = ww + pp * 2;
    var inWidth = ptWidth / 72;
    if (inWidth >= 11 && inWidth <= 11.5) {
      // Round up to letter size.
      attrs.layout = LAYOUT.US_LETTER_LANDSCAPE;
    } else if (inWidth >= 7 && inWidth <= 9) {
      // Round up to letter size.
      attrs.layout = LAYOUT.US_LETTER_PORTRAIT;
    } else {
      attrs.width = ptWidth;
      if (pp) {
        attrs.padding = pp;
      }
    }
  }

  return attrs;
}

var DocNodeSpec = {
  attrs: {
    layout: { default: null },
    padding: { default: null },
    width: { default: null }
  },
  content: 'block+'
};
exports.default = DocNodeSpec;