'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _prosemirrorState = require('prosemirror-state');

var _DocNodeSpec = require('./DocNodeSpec');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SPEC = {
  props: {
    attributes: renderAttributes
  }
};

function renderAttributes(editorState) {
  var doc = editorState.doc;

  var attrs = {
    class: 'czi-prosemirror-editor'
  };

  var _doc$attrs = doc.attrs,
      width = _doc$attrs.width,
      padding = _doc$attrs.padding,
      layout = _doc$attrs.layout;


  var style = '';
  var computedLayout = void 0;
  if (width) {
    var inWidth = width / 72;
    if (!computedLayout && inWidth >= 11 && inWidth <= 11.5) {
      // Round up to letter size.
      computedLayout = _DocNodeSpec.LAYOUT.US_LETTER_LANDSCAPE;
    } else if (!computedLayout && inWidth >= 8 && inWidth <= 8.6) {
      // Round up to letter size.
      computedLayout = _DocNodeSpec.LAYOUT.US_LETTER_PORTRAIT;
    } else {
      // Use custom width (e.g. imported from google doc).
      style += 'width: ' + width + 'pt;';
    }
    if (padding) {
      style += 'padding-left: ' + padding + 'pt;';
      style += 'padding-right: ' + padding + 'pt;';
    }
    attrs.style = style;
  } else {
    computedLayout = layout;
  }
  if (computedLayout) {
    attrs[_DocNodeSpec.ATTRIBUTE_LAYOUT] = computedLayout;
  }
  return attrs;
}

// Unfortunately the root node `doc` does not supoort `toDOM`, thus
// we'd have to assign its `attributes` manually.

var EditorPageLayoutPlugin = function (_Plugin) {
  (0, _inherits3.default)(EditorPageLayoutPlugin, _Plugin);

  function EditorPageLayoutPlugin() {
    (0, _classCallCheck3.default)(this, EditorPageLayoutPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (EditorPageLayoutPlugin.__proto__ || (0, _getPrototypeOf2.default)(EditorPageLayoutPlugin)).call(this, SPEC));
  }

  return EditorPageLayoutPlugin;
}(_prosemirrorState.Plugin);

exports.default = EditorPageLayoutPlugin;