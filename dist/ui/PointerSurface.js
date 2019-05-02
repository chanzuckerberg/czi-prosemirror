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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _preventEventDefault = require('./preventEventDefault');

var _preventEventDefault2 = _interopRequireDefault(_preventEventDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_PointerSurfaceProps', {
  value: require('prop-types').shape({
    active: require('prop-types').bool,
    children: require('prop-types').any,
    className: require('prop-types').string,
    disabled: require('prop-types').bool,
    id: require('prop-types').string,
    onClick: require('prop-types').func,
    onMouseEnter: require('prop-types').func,
    style: require('prop-types').object,
    title: require('prop-types').string,
    value: require('prop-types').any
  })
});

var PointerSurface = function (_React$PureComponent) {
  (0, _inherits3.default)(PointerSurface, _React$PureComponent);

  function PointerSurface() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PointerSurface);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PointerSurface.__proto__ || (0, _getPrototypeOf2.default)(PointerSurface)).call.apply(_ref, [this].concat(args))), _this), _this._clicked = false, _this._mul = false, _this._pressedTarget = null, _this._unmounted = false, _this.state = { pressed: false }, _this._onMouseEnter = function (e) {
      _this._pressedTarget = null;
      e.preventDefault();
      var _this$props = _this.props,
          onMouseEnter = _this$props.onMouseEnter,
          value = _this$props.value;

      onMouseEnter && onMouseEnter(value, e);
    }, _this._onMouseLeave = function (e) {
      _this._pressedTarget = null;
      var mouseUpEvent = e;
      _this._onMouseUpCapture(mouseUpEvent);
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
      _this.setState({ pressed: false });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(PointerSurface, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          disabled = _props.disabled,
          active = _props.active,
          id = _props.id,
          style = _props.style,
          title = _props.title,
          children = _props.children;
      var pressed = this.state.pressed;


      var buttonClassName = (0, _classnames2.default)(className, {
        active: active,
        disabled: disabled,
        pressed: pressed
      });

      return _react2.default.createElement(
        'span',
        {
          'aria-disabled': disabled,
          'aria-pressed': pressed,
          className: buttonClassName,
          disabled: disabled,
          id: id,
          onKeyPress: disabled ? _preventEventDefault2.default : this._onMouseUp,
          onMouseDown: disabled ? _preventEventDefault2.default : this._onMouseDown,
          onMouseEnter: disabled ? _preventEventDefault2.default : this._onMouseEnter,
          onMouseLeave: disabled ? null : this._onMouseLeave,
          onMouseUp: disabled ? _preventEventDefault2.default : this._onMouseUp,
          role: 'button',
          style: style,
          tabIndex: disabled ? null : 0,
          title: title
        },
        children
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
  return PointerSurface;
}(_react2.default.PureComponent);

exports.default = PointerSurface;