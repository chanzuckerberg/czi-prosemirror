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

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _CommandMenuButton = require('./CommandMenuButton');

var _CommandMenuButton2 = _interopRequireDefault(_CommandMenuButton);

var _FontTypeCommand = require('../FontTypeCommand');

var _FontTypeCommand2 = _interopRequireDefault(_FontTypeCommand);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _findActiveFontType = require('./findActiveFontType');

var _findActiveFontType2 = _interopRequireDefault(_findActiveFontType);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _FontTypeMarkSpec = require('../FontTypeMarkSpec');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FONT_TYPE_COMMANDS = (0, _defineProperty3.default)({}, _findActiveFontType.FONT_TYPE_NAME_DEFAULT, new _FontTypeCommand2.default(''));

_FontTypeMarkSpec.FONT_TYPE_NAMES.forEach(function (name) {
  FONT_TYPE_COMMANDS[name] = new _FontTypeCommand2.default(name);
});

var COMMAND_GROUPS = [FONT_TYPE_COMMANDS];

var FontTypeCommandMenuButton = function (_React$PureComponent) {
  (0, _inherits3.default)(FontTypeCommandMenuButton, _React$PureComponent);

  function FontTypeCommandMenuButton() {
    (0, _classCallCheck3.default)(this, FontTypeCommandMenuButton);
    return (0, _possibleConstructorReturn3.default)(this, (FontTypeCommandMenuButton.__proto__ || (0, _getPrototypeOf2.default)(FontTypeCommandMenuButton)).apply(this, arguments));
  }

  (0, _createClass3.default)(FontTypeCommandMenuButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          dispatch = _props.dispatch,
          editorState = _props.editorState,
          editorView = _props.editorView;

      var fontType = (0, _findActiveFontType2.default)(editorState);
      return _react2.default.createElement(_CommandMenuButton2.default, {
        className: 'width-100',
        commandGroups: COMMAND_GROUPS,
        dispatch: dispatch,
        editorState: editorState,
        editorView: editorView,
        label: fontType
      });
    }
  }]);
  return FontTypeCommandMenuButton;
}(_react2.default.PureComponent);

exports.default = FontTypeCommandMenuButton;