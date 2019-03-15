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

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CommandMenuButton = require('./CommandMenuButton');

var _CommandMenuButton2 = _interopRequireDefault(_CommandMenuButton);

var _EditorToolbarConfig = require('./EditorToolbarConfig');

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

require('./czi-table-cell-menu.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableCellMenu = function (_React$PureComponent) {
  (0, _inherits3.default)(TableCellMenu, _React$PureComponent);

  function TableCellMenu() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TableCellMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TableCellMenu.__proto__ || (0, _getPrototypeOf2.default)(TableCellMenu)).call.apply(_ref, [this].concat(args))), _this), _this._menu = null, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(TableCellMenu, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          editorState = _props.editorState,
          editorView = _props.editorView;

      return _react2.default.createElement(_CommandMenuButton2.default, {
        className: 'czi-table-cell-menu',
        commandGroups: _EditorToolbarConfig.TABLE_COMMANDS_GROUP,
        dispatch: editorView.dispatch,
        editorState: editorState,
        editorView: editorView,
        icon: _Icon2.default.get('edit'),
        title: 'Edit'
      });
    }
  }]);
  return TableCellMenu;
}(_react2.default.PureComponent);

exports.default = TableCellMenu;