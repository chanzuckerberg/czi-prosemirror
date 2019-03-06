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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sanitizeURL = require('../sanitizeURL');

var _sanitizeURL2 = _interopRequireDefault(_sanitizeURL);

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _KeyCodes = require('./KeyCodes');

var _preventEventDefault = require('./preventEventDefault');

var _preventEventDefault2 = _interopRequireDefault(_preventEventDefault);

require('./czi-form.css');

require('./czi-image-url-editor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BAD_CHARACTER_PATTER = /\s/;

var LinkURLEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(LinkURLEditor, _React$PureComponent);

  function LinkURLEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LinkURLEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = LinkURLEditor.__proto__ || (0, _getPrototypeOf2.default)(LinkURLEditor)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      url: _this.props.href
    }, _this._onKeyDown = function (e) {
      if (e.keyCode === _KeyCodes.ENTER) {
        e.preventDefault();
        _this._apply();
      }
    }, _this._onURLChange = function (e) {
      var url = e.target.value;
      _this.setState({
        url: url
      });
    }, _this._cancel = function () {
      _this.props.close();
    }, _this._apply = function () {
      var url = _this.state.url;

      if (url && !BAD_CHARACTER_PATTER.test(url)) {
        _this.props.close((0, _sanitizeURL2.default)(url));
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(LinkURLEditor, [{
    key: 'render',
    value: function render() {
      var href = this.props.href;
      var url = this.state.url;


      var error = url ? BAD_CHARACTER_PATTER.test(url) : false;

      var label = 'Apply';
      var disabled = !!error;
      if (href) {
        label = url ? 'Apply' : 'Remove';
        disabled = error;
      } else {
        disabled = error || !url;
      }

      return _react2.default.createElement(
        'div',
        { className: 'czi-image-url-editor' },
        _react2.default.createElement(
          'form',
          { className: 'czi-form', onSubmit: _preventEventDefault2.default },
          _react2.default.createElement(
            'fieldset',
            null,
            _react2.default.createElement(
              'legend',
              null,
              'Add a Link'
            ),
            _react2.default.createElement('input', {
              autoFocus: true,
              onChange: this._onURLChange,
              onKeyDown: this._onKeyDown,
              placeholder: 'Paste a URL',
              spellCheck: false,
              type: 'text',
              value: url || ''
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'czi-form-buttons' },
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Cancel',
              onClick: this._cancel
            }),
            _react2.default.createElement(_CustomButton2.default, {
              active: true,
              disabled: disabled,
              label: label,
              onClick: this._apply
            })
          )
        )
      );
    }
  }]);
  return LinkURLEditor;
}(_react2.default.PureComponent);

exports.default = LinkURLEditor;