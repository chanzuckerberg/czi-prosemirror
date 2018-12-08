'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

require('./czi-custom-menu-item.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomMenuItemSeparator = function (_React$PureComponent) {
  (0, _inherits3.default)(CustomMenuItemSeparator, _React$PureComponent);

  function CustomMenuItemSeparator() {
    (0, _classCallCheck3.default)(this, CustomMenuItemSeparator);
    return (0, _possibleConstructorReturn3.default)(this, (CustomMenuItemSeparator.__proto__ || (0, _getPrototypeOf2.default)(CustomMenuItemSeparator)).apply(this, arguments));
  }

  (0, _createClass3.default)(CustomMenuItemSeparator, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'czi-custom-menu-item-separator' });
    }
  }]);
  return CustomMenuItemSeparator;
}(_react2.default.PureComponent);

var CustomMenuItem = function (_React$PureComponent2) {
  (0, _inherits3.default)(CustomMenuItem, _React$PureComponent2);

  function CustomMenuItem() {
    (0, _classCallCheck3.default)(this, CustomMenuItem);
    return (0, _possibleConstructorReturn3.default)(this, (CustomMenuItem.__proto__ || (0, _getPrototypeOf2.default)(CustomMenuItem)).apply(this, arguments));
  }

  (0, _createClass3.default)(CustomMenuItem, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_CustomButton2.default, (0, _extends3.default)({}, this.props, {
        className: 'czi-custom-menu-item'
      }));
    }
  }]);
  return CustomMenuItem;
}(_react2.default.PureComponent);

CustomMenuItem.Separator = CustomMenuItemSeparator;
exports.default = CustomMenuItem;