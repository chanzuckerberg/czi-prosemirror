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

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ImageSourceCommand2 = require('./ImageSourceCommand');

var _ImageSourceCommand3 = _interopRequireDefault(_ImageSourceCommand2);

var _ImageUploadEditor = require('./ui/ImageUploadEditor');

var _ImageUploadEditor2 = _interopRequireDefault(_ImageUploadEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageUploadCommand = function (_ImageSourceCommand) {
  (0, _inherits3.default)(ImageUploadCommand, _ImageSourceCommand);

  function ImageUploadCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageUploadCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageUploadCommand.__proto__ || (0, _getPrototypeOf2.default)(ImageUploadCommand)).call.apply(_ref, [this].concat(args))), _this), _this.isEnabled = function (state, view) {
      if (!view) {
        return false;
      }

      var runtime = view.runtime;

      if (!runtime) {
        return false;
      }

      var canUploadImage = runtime.canUploadImage,
          uploadImage = runtime.uploadImage;

      if (!canUploadImage || !uploadImage) {
        return false;
      }
      if (!canUploadImage()) {
        return false;
      }

      return _this.__isEnabled(state, view);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ImageUploadCommand, [{
    key: 'getEditor',
    value: function getEditor() {
      return _ImageUploadEditor2.default;
    }
  }]);
  return ImageUploadCommand;
}(_ImageSourceCommand3.default);

exports.default = ImageUploadCommand;