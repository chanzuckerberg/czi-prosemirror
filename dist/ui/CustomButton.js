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

require('./czi-custom-button.css');

var _PointerSurface = require('./PointerSurface');

var _PointerSurface2 = _interopRequireDefault(_PointerSurface);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TooltipSurface = require('./TooltipSurface');

var _TooltipSurface2 = _interopRequireDefault(_TooltipSurface);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_PointerSurfaceProps = require('./PointerSurface').babelPluginFlowReactPropTypes_proptype_PointerSurfaceProps || require('prop-types').any;

var CustomButton = function (_React$PureComponent) {
  (0, _inherits3.default)(CustomButton, _React$PureComponent);

  function CustomButton() {
    (0, _classCallCheck3.default)(this, CustomButton);
    return (0, _possibleConstructorReturn3.default)(this, (CustomButton.__proto__ || (0, _getPrototypeOf2.default)(CustomButton)).apply(this, arguments));
  }

  (0, _createClass3.default)(CustomButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          icon = _props.icon,
          label = _props.label,
          className = _props.className,
          title = _props.title,
          pointerProps = (0, _objectWithoutProperties3.default)(_props, ['icon', 'label', 'className', 'title']);

      var klass = (0, _classnames2.default)(className, 'czi-custom-button', {
        'use-icon': !!icon
      });
      return _react2.default.createElement(
        _TooltipSurface2.default,
        { tooltip: title },
        _react2.default.createElement(
          _PointerSurface2.default,
          (0, _extends3.default)({}, pointerProps, { className: klass }),
          icon,
          label
        )
      );
    }
  }]);
  return CustomButton;
}(_react2.default.PureComponent);

exports.default = CustomButton;