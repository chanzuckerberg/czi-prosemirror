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

require('./czi-form.css');

require('./czi-math-editor.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _MathQuillEditor = require('./mathquill-editor/MathQuillEditor');

var _MathQuillEditor2 = _interopRequireDefault(_MathQuillEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MathEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(MathEditor, _React$PureComponent);

  function MathEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MathEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MathEditor.__proto__ || (0, _getPrototypeOf2.default)(MathEditor)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      value: _this.props.initialValue || ''
    }, _this._id = (0, _uuid2.default)(), _this._unmounted = false, _this._onChange = function (value) {
      _this.setState({ value: value });
    }, _this._cancel = function () {
      _this.props.close();
    }, _this._insert = function () {
      _this.props.close(_this.state.value);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(MathEditor, [{
    key: 'render',
    value: function render() {
      var value = this.state.value;

      return _react2.default.createElement(
        'div',
        { className: 'czi-math-editor' },
        _react2.default.createElement(
          'form',
          { className: 'czi-form' },
          _react2.default.createElement(
            'fieldset',
            null,
            _react2.default.createElement(
              'legend',
              null,
              'Insert Math'
            ),
            _react2.default.createElement(_MathQuillEditor2.default, {
              onChange: this._onChange,
              value: value
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
              disabled: !this.state.value,
              label: 'Insert',
              onClick: this._insert
            })
          )
        )
      );
    }
  }]);
  return MathEditor;
}(_react2.default.PureComponent);

exports.default = MathEditor;