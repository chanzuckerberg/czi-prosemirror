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
        { className: 'czi-tooltip-view' },
        tooltip
      );
    }
  }]);
  return TooltipView;
}(_react2.default.PureComponent);

var activeID = 0;
var activePopUp = null;
var activeView = null;
var activeX = 0;
var activeY = 0;
var mountedCount = 0;
var movedCount = 0;

function onMouseMove(e) {
  if (activeID) {
    activeX = activeX || e.clientX;
    activeY = activeY || e.clientY;
    var dy = activeY - e.clientY;
    var dx = activeX - e.clientX;
    var dd = 10 * 10;
    if (dx * dx > dd || dy * dy > dd) {
      activePopUp && activePopUp.close();
      clearTimeout(activeID);
    }
  }
}

var TooltipSurface = function (_React$PureComponent2) {
  (0, _inherits3.default)(TooltipSurface, _React$PureComponent2);

  function TooltipSurface() {
    var _ref;

    var _temp, _this2, _ret;

    (0, _classCallCheck3.default)(this, TooltipSurface);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref = TooltipSurface.__proto__ || (0, _getPrototypeOf2.default)(TooltipSurface)).call.apply(_ref, [this].concat(args))), _this2), _this2._id = (0, _uuid2.default)(), _this2._onMouseMove = function (e) {
      if (activeView === _this2 && activePopUp) {
        return;
      }
      activePopUp && activePopUp.close();
      activeID && window.clearTimeout(activeID);
      activeID = setTimeout(_this2._show, 350);
      activeView = _this2;
    }, _this2._onMouseDown = function () {
      activeID && window.clearTimeout(activeID);
      _this2._hide();
    }, _this2._onClose = function () {
      activeID = null;
      activePopUp = null;
      activeX = 0;
      activeY = 0;
      activeView = null;
    }, _this2._show = function () {
      activePopUp && activePopUp.close();
      activePopUp = null;
      var tooltip = _this2.props.tooltip;

      if (tooltip) {
        activePopUp = (0, _createPopUp2.default)(TooltipView, { tooltip: tooltip }, {
          anchor: document.getElementById(_this2._id),
          onClose: _this2._onClose
        });
      }
    }, _this2._hide = function () {
      activePopUp && activePopUp.close();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this2, _ret);
  }

  (0, _createClass3.default)(TooltipSurface, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      mountedCount++;
      if (mountedCount === 1) {
        document.addEventListener('mousemove', onMouseMove, true);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._hide();
      mountedCount--;
      if (mountedCount === 0) {
        document.removeEventListener('mousemove', onMouseMove, true);
      }
      if (activeView === this) {
        activePopUp && activePopUp.close();
        activeID && clearTimeout(activeID);
      }
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
          onMouseMove: tooltip && this._onMouseMove,
          onMouseDown: tooltip && this._onMouseDown,
          role: 'tooltip' },
        children
      );
    }
  }]);
  return TooltipSurface;
}(_react2.default.PureComponent);

exports.default = TooltipSurface;