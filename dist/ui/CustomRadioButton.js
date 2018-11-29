'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

require('./czi-custom-radio-button.css');

var _PointerSurface = require('./PointerSurface');

var _PointerSurface2 = _interopRequireDefault(_PointerSurface);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _preventEventDefault = require('./preventEventDefault');

var _preventEventDefault2 = _interopRequireDefault(_preventEventDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_PointerSurfaceProps = require('./PointerSurface').babelPluginFlowReactPropTypes_proptype_PointerSurfaceProps || require('prop-types').any;

var CustomRadioButton = function (_React$PureComponent) {
  (0, _inherits3.default)(CustomRadioButton, _React$PureComponent);

  function CustomRadioButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CustomRadioButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CustomRadioButton.__proto__ || (0, _getPrototypeOf2.default)(CustomRadioButton)).call.apply(_ref, [this].concat(args))), _this), _this._name = (0, _uuid2.default)(), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(CustomRadioButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          title = _props.title,
          className = _props.className,
          checked = _props.checked,
          label = _props.label,
          inline = _props.inline,
          name = _props.name,
          onSelect = _props.onSelect,
          disabled = _props.disabled,
          pointerProps = (0, _objectWithoutProperties3.default)(_props, ['title', 'className', 'checked', 'label', 'inline', 'name', 'onSelect', 'disabled']);


      var klass = (0, _classnames2.default)(className, 'czi-custom-radio-button', {
        'checked': checked,
        'inline': inline
      });

      return _react2.default.createElement(
        _PointerSurface2.default,
        (0, _extends3.default)({}, pointerProps, {
          disabled: disabled,
          className: klass,
          onClick: onSelect,
          title: title || label }),
        _react2.default.createElement('input', {
          checked: checked,
          className: 'czi-custom-radio-button-input',
          disabled: disabled,
          name: name || this._name,
          tabIndex: disabled ? null : 0,
          type: 'radio',
          onChange: _preventEventDefault2.default
        }),
        _react2.default.createElement('span', { className: 'czi-custom-radio-button-icon' }),
        _react2.default.createElement(
          'span',
          { className: 'czi-custom-radio-button-label' },
          label
        )
      );
    }
  }]);
  return CustomRadioButton;
}(_react2.default.PureComponent);

exports.default = CustomRadioButton;