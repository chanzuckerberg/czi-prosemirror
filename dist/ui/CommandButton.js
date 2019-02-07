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

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _UICommand = require('./UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CommandButton = function (_React$PureComponent) {
  (0, _inherits3.default)(CommandButton, _React$PureComponent);

  function CommandButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CommandButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CommandButton.__proto__ || (0, _getPrototypeOf2.default)(CommandButton)).call.apply(_ref, [this].concat(args))), _this), _this._onUIEnter = function (command, event) {
      if (command.shouldRespondToUIEvent(event)) {
        _this._execute(command, event);
      }
    }, _this._execute = function (value, event) {
      var _this$props = _this.props,
          command = _this$props.command,
          editorState = _this$props.editorState,
          dispatch = _this$props.dispatch,
          editorView = _this$props.editorView;

      command.execute(editorState, dispatch, editorView, event);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(CommandButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          label = _props.label,
          className = _props.className,
          command = _props.command,
          editorState = _props.editorState,
          editorView = _props.editorView,
          icon = _props.icon,
          title = _props.title;

      var disabled = this.props.disabled;
      if (!!disabled === false) {
        disabled = !editorView || !command.isEnabled(editorState, editorView);
      }
      return _react2.default.createElement(_CustomButton2.default, {
        active: command.isActive(editorState),
        className: className,
        disabled: disabled,
        icon: icon,
        label: label,
        onClick: this._onUIEnter,
        onMouseEnter: this._onUIEnter,
        title: title,
        value: command
      });
    }
  }]);
  return CommandButton;
}(_react2.default.PureComponent);

exports.default = CommandButton;