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

require('./czi-tooltip-surface.css');

require('./czi-animations.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createPopUp = require('./createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TooltipView = function (_React$PureComponent) {
  (0, _inherits3.default)(TooltipView, _React$PureComponent);

  function TooltipView() {
    (0, _classCallCheck3.default)(this, TooltipView);
    return (0, _possibleConstructorReturn3.default)(this, (TooltipView.__proto__ || (0, _getPrototypeOf2.default)(TooltipView)).apply(this, arguments));
  }

  (0, _createClass3.default)(TooltipView, [{
    key: 'render',
    value: function render() {
      var tooltip = this.props.tooltip;

      return _react2.default.createElement(
        'div',
        { className: 'czi-tooltip-view czi-animation-fade-in' },
        tooltip
      );
    }
  }]);
  return TooltipView;
}(_react2.default.PureComponent);

var TooltipSurface = function (_React$PureComponent2) {
  (0, _inherits3.default)(TooltipSurface, _React$PureComponent2);

  function TooltipSurface() {
    var _ref;

    var _temp, _this2, _ret;

    (0, _classCallCheck3.default)(this, TooltipSurface);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref = TooltipSurface.__proto__ || (0, _getPrototypeOf2.default)(TooltipSurface)).call.apply(_ref, [this].concat(args))), _this2), _this2._id = (0, _uuid2.default)(), _this2._popUp = null, _this2._onMouseEnter = function () {
      if (!_this2._popUp) {
        var _tooltip = _this2.props.tooltip;

        _this2._popUp = (0, _createPopUp2.default)(TooltipView, { tooltip: _tooltip }, {
          anchor: document.getElementById(_this2._id),
          onClose: _this2._onClose
        });
      }
    }, _this2._onMouseLeave = function () {
      _this2._popUp && _this2._popUp.close();
      _this2._popUp = null;
    }, _this2._onClose = function () {
      _this2._popUp = null;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this2, _ret);
  }

  (0, _createClass3.default)(TooltipSurface, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._popUp && this._popUp.close();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          tooltip = _props.tooltip,
          children = _props.children;

      return _react2.default.createElement(
        'span',
        {
          'aria-label': tooltip,
          className: 'czi-tooltip-surface',
          'data-tooltip': tooltip,
          id: this._id,
          onMouseDown: tooltip && this._onMouseLeave,
          onMouseEnter: tooltip && this._onMouseEnter,
          onMouseLeave: tooltip && this._onMouseLeave,
          role: 'tooltip' },
        children
      );
    }
  }]);
  return TooltipSurface;
}(_react2.default.PureComponent);

exports.default = TooltipSurface;