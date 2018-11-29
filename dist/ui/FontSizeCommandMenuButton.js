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

var _CommandMenuButton = require('./CommandMenuButton');

var _CommandMenuButton2 = _interopRequireDefault(_CommandMenuButton);

var _FontSizeCommand = require('../FontSizeCommand');

var _FontSizeCommand2 = _interopRequireDefault(_FontSizeCommand);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _UICommand = require('./UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _findActiveFontSize = require('./findActiveFontSize');

var _findActiveFontSize2 = _interopRequireDefault(_findActiveFontSize);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('../NodeNames');

var _MarkNames = require('../MarkNames');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FONT_PT_SIZES = [8, 9, 11, 10, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];

var FONT_PT_SIZE_COMMANDS = FONT_PT_SIZES.reduce(function (memo, size) {
  memo[' ' + size + ' '] = new _FontSizeCommand2.default(size);
  return memo;
}, {});

var COMMAND_GROUPS = [{ 'Default': new _FontSizeCommand2.default(0) }, FONT_PT_SIZE_COMMANDS];

var FontSizeCommandMenuButton = function (_React$PureComponent) {
  (0, _inherits3.default)(FontSizeCommandMenuButton, _React$PureComponent);

  function FontSizeCommandMenuButton() {
    (0, _classCallCheck3.default)(this, FontSizeCommandMenuButton);
    return (0, _possibleConstructorReturn3.default)(this, (FontSizeCommandMenuButton.__proto__ || (0, _getPrototypeOf2.default)(FontSizeCommandMenuButton)).apply(this, arguments));
  }

  (0, _createClass3.default)(FontSizeCommandMenuButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          dispatch = _props.dispatch,
          editorState = _props.editorState,
          editorView = _props.editorView;

      var fontSize = (0, _findActiveFontSize2.default)(editorState);
      return _react2.default.createElement(_CommandMenuButton2.default, {
        className: 'width-30',
        commandGroups: COMMAND_GROUPS,
        dispatch: dispatch,
        editorState: editorState,
        editorView: editorView,
        label: fontSize
      });
    }
  }]);
  return FontSizeCommandMenuButton;
}(_react2.default.PureComponent);

exports.default = FontSizeCommandMenuButton;