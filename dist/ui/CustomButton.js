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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./czi-custom-button.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop(e) {
  e.preventDefault();
}

var CustomButton = function (_React$PureComponent) {
  (0, _inherits3.default)(CustomButton, _React$PureComponent);

  function CustomButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CustomButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CustomButton.__proto__ || (0, _getPrototypeOf2.default)(CustomButton)).call.apply(_ref, [this].concat(args))), _this), _this._clicked = false, _this._mul = false, _this._pressedTarget = null, _this._unmounted = false, _this.state = { pressed: false }, _this._onMouseEnter = function (e) {
      _this._pressedTarget = null;
      e.preventDefault();
      var _this$props = _this.props,
          onMouseEnter = _this$props.onMouseEnter,
          value = _this$props.value;

      onMouseEnter && onMouseEnter(value, e);
    }, _this._onMouseDown = function (e) {
      e.preventDefault();

      _this._pressedTarget = null;
      _this._clicked = false;

      if (e.which === 3 || e.button == 2) {
        // right click.
        return;
      }

      _this.setState({ pressed: true });
      _this._pressedTarget = e.currentTarget;
      _this._clicked = false;

      if (!_this._mul) {
        document.addEventListener('mouseup', _this._onMouseUpCapture, true);
        _this._mul = true;
      }
    }, _this._onMouseUp = function (e) {
      e.preventDefault();

      _this.setState({ pressed: false });

      if (_this._clicked || e.type === 'keypress') {
        var _this$props2 = _this.props,
            _onClick = _this$props2.onClick,
            _value = _this$props2.value,
            _disabled = _this$props2.disabled;

        !_disabled && _onClick && _onClick(_value, e);
      }

      _this._pressedTarget = null;
      _this._clicked = false;
    }, _this._onMouseUpCapture = function (e) {
      if (_this._mul) {
        _this._mul = false;
        document.removeEventListener('mouseup', _this._onMouseUpCapture, true);
      }
      var target = e.target;
      _this._clicked = _this._pressedTarget instanceof HTMLElement && target instanceof HTMLElement && (target === _this._pressedTarget || target.contains(_this._pressedTarget) || _this._pressedTarget.contains(target));
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(CustomButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          label = _props.label,
          icon = _props.icon,
          disabled = _props.disabled,
          active = _props.active,
          id = _props.id,
          style = _props.style,
          title = _props.title;
      var pressed = this.state.pressed;


      var buttonClassName = (0, _classnames2.default)(className, {
        'active': active,
        'czi-custom-button': true,
        'disabled': disabled,
        'pressed': pressed,
        'use-icon': !!icon
      });

      return _react2.default.createElement(
        'span',
        {
          'aria-pressed': pressed,
          className: buttonClassName,
          id: id,
          onKeyPress: disabled ? noop : this._onMouseUp,
          onMouseDown: disabled ? noop : this._onMouseDown,
          onMouseEnter: disabled ? noop : this._onMouseEnter,
          onMouseUp: disabled ? noop : this._onMouseUp,
          role: 'button',
          style: style,
          tabIndex: 0,
          title: title || label },
        icon,
        label
      );
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      if (this._mul) {
        this._mul = false;
        document.removeEventListener('mouseup', this._onMouseUpCapture, true);
      }
    }
  }]);
  return CustomButton;
}(_react2.default.PureComponent);

exports.default = CustomButton;