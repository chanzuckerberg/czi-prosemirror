'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _CommandMenu = require('./CommandMenu');

var _CommandMenu2 = _interopRequireDefault(_CommandMenu);

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _UICommand = require('./UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

var _createPopUp = require('./createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

require('./czi-custom-menu-button.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CommandMenuButton = function (_React$PureComponent) {
  (0, _inherits3.default)(CommandMenuButton, _React$PureComponent);

  function CommandMenuButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CommandMenuButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CommandMenuButton.__proto__ || (0, _getPrototypeOf2.default)(CommandMenuButton)).call.apply(_ref, [this].concat(args))), _this), _this._menu = null, _this._id = (0, _uuid2.default)(), _this.state = {
      expanded: false
    }, _this._onClick = function () {
      var expanded = !_this.state.expanded;
      _this.setState({
        expanded: expanded
      });
      expanded ? _this._showMenu() : _this._hideMenu();
    }, _this._hideMenu = function () {
      var menu = _this._menu;
      _this._menu = null;
      menu && menu.close();
    }, _this._showMenu = function () {
      var menu = _this._menu;
      var menuProps = (0, _extends3.default)({}, _this.props, {
        onCommand: _this._onCommand
      });
      if (menu) {
        menu.update(menuProps);
      } else {
        _this._menu = (0, _createPopUp2.default)(_CommandMenu2.default, menuProps, {
          anchor: document.getElementById(_this._id),
          onClose: _this._onClose
        });
      }
    }, _this._onCommand = function () {
      _this.setState({ expanded: false });
      _this._hideMenu();
    }, _this._onClose = function () {
      if (_this._menu) {
        _this.setState({ expanded: false });
        _this._menu = null;
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(CommandMenuButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          label = _props.label,
          commandGroups = _props.commandGroups,
          editorState = _props.editorState,
          editorView = _props.editorView,
          icon = _props.icon,
          disabled = _props.disabled,
          title = _props.title;

      var enabled = !disabled && commandGroups.some(function (group, ii) {
        return (0, _keys2.default)(group).some(function (label) {
          var command = group[label];
          var disabledVal = true;
          try {
            disabledVal = !editorView || !command.isEnabled(editorState, editorView);
          } catch (ex) {
            disabledVal = false;
          }
          return !disabledVal;
        });
      });

      var expanded = this.state.expanded;

      var buttonClassName = (0, _classnames2.default)(className, {
        'czi-custom-menu-button': true,
        expanded: expanded
      });

      return _react2.default.createElement(_CustomButton2.default, {
        className: buttonClassName,
        disabled: !enabled,
        icon: icon,
        id: this._id,
        label: label,
        onClick: this._onClick,
        title: title
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._hideMenu();
    }
  }]);
  return CommandMenuButton;
}(_react2.default.PureComponent);

exports.default = CommandMenuButton;