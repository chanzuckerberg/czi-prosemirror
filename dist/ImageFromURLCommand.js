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

var _ImageSourceCommand2 = require('./ImageSourceCommand');

var _ImageSourceCommand3 = _interopRequireDefault(_ImageSourceCommand2);

var _ImageURLEditor = require('./ui/ImageURLEditor');

var _ImageURLEditor2 = _interopRequireDefault(_ImageURLEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageFromURLCommand = function (_ImageSourceCommand) {
  (0, _inherits3.default)(ImageFromURLCommand, _ImageSourceCommand);

  function ImageFromURLCommand() {
    (0, _classCallCheck3.default)(this, ImageFromURLCommand);
    return (0, _possibleConstructorReturn3.default)(this, (ImageFromURLCommand.__proto__ || (0, _getPrototypeOf2.default)(ImageFromURLCommand)).apply(this, arguments));
  }

  (0, _createClass3.default)(ImageFromURLCommand, [{
    key: 'getEditor',
    value: function getEditor() {
      return _ImageURLEditor2.default;
    }
  }]);
  return ImageFromURLCommand;
}(_ImageSourceCommand3.default);

exports.default = ImageFromURLCommand;