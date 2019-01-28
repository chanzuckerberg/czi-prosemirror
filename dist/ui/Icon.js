'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _canUseCSSFont = require('./canUseCSSFont');

var _canUseCSSFont2 = _interopRequireDefault(_canUseCSSFont);

var _injectStyleSheet = require('./injectStyleSheet');

var _injectStyleSheet2 = _interopRequireDefault(_injectStyleSheet);

require('./czi-icon.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VALID_CHARS = /[a-z_]+/;

var cached = {};

var CSS_CDN_URL = '//fonts.googleapis.com/icon?family=Material+Icons';
var CSS_FONT = 'Material Icons';

(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var fontSupported;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _canUseCSSFont2.default)(CSS_FONT);

        case 2:
          fontSupported = _context.sent;

          if (!fontSupported) {
            console.info('Add CSS from ', CSS_CDN_URL);
            (0, _injectStyleSheet2.default)(CSS_CDN_URL);
          }

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}))();

var Icon = function (_React$PureComponent) {
  (0, _inherits3.default)(Icon, _React$PureComponent);

  function Icon() {
    (0, _classCallCheck3.default)(this, Icon);
    return (0, _possibleConstructorReturn3.default)(this, (Icon.__proto__ || (0, _getPrototypeOf2.default)(Icon)).apply(this, arguments));
  }

  (0, _createClass3.default)(Icon, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          type = _props.type,
          title = _props.title;

      var className = '';
      var children = '';
      if (!type || !VALID_CHARS.test(type)) {
        className = (0, _classnames2.default)('czi-icon-unknown');
        children = title || type;
      } else {
        className = (0, _classnames2.default)('czi-icon', (0, _defineProperty3.default)({}, type, true));
        children = type;
      }
      return _react2.default.createElement(
        'span',
        { className: className },
        children
      );
    }
  }], [{
    key: 'get',


    // Get the static Icon.
    value: function get(type, title) {
      var key = (type || '') + '-' + (title || '');
      var icon = cached[key] || _react2.default.createElement(Icon, { title: title, type: type });
      cached[key] = icon;
      return icon;
    }
  }]);
  return Icon;
}(_react2.default.PureComponent);

exports.default = Icon;