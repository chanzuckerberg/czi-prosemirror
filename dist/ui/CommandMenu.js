'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _CustomMenu = require('./CustomMenu');

var _CustomMenu2 = _interopRequireDefault(_CustomMenu);

var _CustomMenuItem = require('./CustomMenuItem');

var _CustomMenuItem2 = _interopRequireDefault(_CustomMenuItem);

var _UICommand = require('./UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CommandMenu = function (_React$PureComponent) {
  (0, _inherits3.default)(CommandMenu, _React$PureComponent);

  function CommandMenu() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CommandMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CommandMenu.__proto__ || (0, _getPrototypeOf2.default)(CommandMenu)).call.apply(_ref, [this].concat(args))), _this), _this._activeCommand = null, _this._onUIEnter = function (command, event) {
      if (command.shouldRespondToUIEvent(event)) {
        _this._activeCommand && _this._activeCommand.cancel();
        _this._activeCommand = command;
        _this._execute(command, event);
      }
    }, _this._execute = function (command, e) {
      var _this$props = _this.props,
          dispatch = _this$props.dispatch,
          editorState = _this$props.editorState,
          editorView = _this$props.editorView,
          onCommand = _this$props.onCommand;

      if (command.execute(editorState, dispatch, editorView, e)) {
        onCommand && onCommand();
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(CommandMenu, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          commandGroups = _props.commandGroups,
          editorState = _props.editorState,
          editorView = _props.editorView;

      var children = [];
      var jj = commandGroups.length - 1;

      commandGroups.forEach(function (group, ii) {
        (0, _keys2.default)(group).forEach(function (label) {
          var command = group[label];
          var disabled = true;
          try {
            disabled = !editorView || !command.isEnabled(editorState, editorView);
          } catch (ex) {
            disabled = false;
          }
          children.push(_react2.default.createElement(_CustomMenuItem2.default, {
            active: command.isActive(editorState),
            disabled: disabled,
            key: label,
            label: command.renderLabel(editorState) || label,
            onClick: _this2._onUIEnter,
            onMouseEnter: _this2._onUIEnter,
            value: command
          }));
        });
        if (ii !== jj) {
          children.push(_react2.default.createElement(_CustomMenuItem2.default.Separator, { key: String(ii) + '-hr' }));
        }
      });
      return _react2.default.createElement(
        _CustomMenu2.default,
        null,
        children
      );
    }
  }]);
  return CommandMenu;
}(_react2.default.PureComponent);

exports.default = CommandMenu;