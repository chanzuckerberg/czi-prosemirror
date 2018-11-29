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

require('./czi-loading-indicator.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://loading.io/css/
var LoadingIndicator = function (_React$PureComponent) {
  (0, _inherits3.default)(LoadingIndicator, _React$PureComponent);

  function LoadingIndicator() {
    (0, _classCallCheck3.default)(this, LoadingIndicator);
    return (0, _possibleConstructorReturn3.default)(this, (LoadingIndicator.__proto__ || (0, _getPrototypeOf2.default)(LoadingIndicator)).apply(this, arguments));
  }

  (0, _createClass3.default)(LoadingIndicator, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'czi-loading-indicator' },
        _react2.default.createElement('div', { className: 'frag czi-loading-indicator-frag-1' }),
        _react2.default.createElement('div', { className: 'frag czi-loading-indicator-frag-2' }),
        _react2.default.createElement('div', { className: 'frag czi-loading-indicator-frag-3' }),
        _react2.default.createElement('div', { className: 'frag czi-loading-indicator-frag-4' })
      );
    }
  }]);
  return LoadingIndicator;
}(_react2.default.PureComponent);

exports.default = LoadingIndicator;