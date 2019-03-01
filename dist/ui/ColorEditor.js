'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

require('./czi-color-editor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateGreyColors(count) {
  var cc = 255;
  var interval = cc / count;
  var colors = [];
  while (cc > 0) {
    var color = (0, _color2.default)({ r: cc, g: cc, b: cc });
    cc -= interval;
    cc = Math.floor(cc);
    colors.unshift(color);
  }
  return colors;
}

function generateRainbowColors(count, saturation, lightness) {
  var colors = [];
  var interval = 360 / count;
  var ss = (0, _clamp2.default)(0, saturation, 100);
  var ll = (0, _clamp2.default)(0, lightness, 100);
  var hue = 0;
  while (hue < 360) {
    var hsl = 'hsl(' + hue + ',' + ss + '%,' + ll + '%)';
    var color = (0, _color2.default)(hsl);
    colors.unshift(color);
    hue += interval;
  }
  return colors;
}

var ColorEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(ColorEditor, _React$PureComponent);

  function ColorEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ColorEditor.__proto__ || (0, _getPrototypeOf2.default)(ColorEditor)).call.apply(_ref, [this].concat(args))), _this), _this._renderColor = function (color, index) {
      var selectedColor = _this.props.hex;
      var hex = color.hex().toLowerCase();
      var style = { backgroundColor: hex };
      var active = selectedColor && selectedColor.toLowerCase() === hex;
      return _react2.default.createElement(_CustomButton2.default, {
        active: active,
        className: 'czi-color-editor-cell',
        key: hex + '-' + index,
        label: '',
        onClick: _this._onSelectColor,
        style: style,
        title: hex,
        value: hex
      });
    }, _this._onSelectColor = function (hex) {
      _this.props.close(hex);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ColorEditor, [{
    key: 'render',
    value: function render() {
      var renderColor = this._renderColor;
      var selectedColor = this.props.hex;
      return _react2.default.createElement(
        'div',
        { className: 'czi-color-editor' },
        _react2.default.createElement(
          'div',
          { className: 'czi-color-editor-section' },
          _react2.default.createElement(_CustomButton2.default, {
            active: !selectedColor,
            className: 'czi-color-editor-color-transparent',
            label: 'Transparent',
            onClick: this._onSelectColor,
            value: 'rgba(0,0,0,0)'
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'czi-color-editor-section' },
          generateGreyColors(10).map(renderColor)
        ),
        _react2.default.createElement(
          'div',
          { className: 'czi-color-editor-section' },
          generateRainbowColors(10, 90, 50).map(renderColor)
        ),
        _react2.default.createElement(
          'div',
          { className: 'czi-color-editor-section' },
          generateRainbowColors(30, 70, 70).map(renderColor)
        ),
        _react2.default.createElement(
          'div',
          { className: 'czi-color-editor-section' },
          generateRainbowColors(30, 90, 30).map(renderColor)
        )
      );
    }
  }]);
  return ColorEditor;
}(_react2.default.PureComponent);

exports.default = ColorEditor;