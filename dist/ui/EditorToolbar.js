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

require('./czi-editor-toolbar.css');

var _EditorCommands = require('../EditorCommands');

var EditorCommands = _interopRequireWildcard(_EditorCommands);

var _CommandButton = require('./CommandButton');

var _CommandButton2 = _interopRequireDefault(_CommandButton);

var _CommandMenuButton = require('./CommandMenuButton');

var _CommandMenuButton2 = _interopRequireDefault(_CommandMenuButton);

var _FontSizeCommandMenuButton = require('./FontSizeCommandMenuButton');

var _FontSizeCommandMenuButton2 = _interopRequireDefault(_FontSizeCommandMenuButton);

var _FontTypeCommandMenuButton = require('./FontTypeCommandMenuButton');

var _FontTypeCommandMenuButton2 = _interopRequireDefault(_FontTypeCommandMenuButton);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ResizeObserver = require('./ResizeObserver');

var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);

var _UICommand = require('./UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

var _createEmptyEditorState = require('../createEmptyEditorState');

var _createEmptyEditorState2 = _interopRequireDefault(_createEmptyEditorState);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _findActiveMark = require('../findActiveMark');

var _findActiveMark2 = _interopRequireDefault(_findActiveMark);

var _isReactClass = require('./isReactClass');

var _isReactClass2 = _interopRequireDefault(_isReactClass);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry = require('./ResizeObserver').babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry || require('prop-types').any;

var EDITOR_EMPTY_STATE = (0, _createEmptyEditorState2.default)();
var ICON_LABEL_PATTERN = /[a-z_]+/;

var BLOCKQUOTE_INFO = EditorCommands.BLOCKQUOTE_INFO,
    CLEAR_FORMAT = EditorCommands.CLEAR_FORMAT,
    CODE = EditorCommands.CODE,
    EM = EditorCommands.EM,
    H1 = EditorCommands.H1,
    H2 = EditorCommands.H2,
    H3 = EditorCommands.H3,
    H4 = EditorCommands.H4,
    H5 = EditorCommands.H5,
    H6 = EditorCommands.H6,
    HISTORY_REDO = EditorCommands.HISTORY_REDO,
    HISTORY_UNDO = EditorCommands.HISTORY_UNDO,
    HR = EditorCommands.HR,
    IMAGE_FROM_URL = EditorCommands.IMAGE_FROM_URL,
    INDENT_LESS = EditorCommands.INDENT_LESS,
    INDENT_MORE = EditorCommands.INDENT_MORE,
    LINK_SET_URL = EditorCommands.LINK_SET_URL,
    OL = EditorCommands.OL,
    PRINT = EditorCommands.PRINT,
    STRIKE = EditorCommands.STRIKE,
    STRONG = EditorCommands.STRONG,
    TABLE_ADD_COLUMN_AFTER = EditorCommands.TABLE_ADD_COLUMN_AFTER,
    TABLE_ADD_COLUMN_BEFORE = EditorCommands.TABLE_ADD_COLUMN_BEFORE,
    TABLE_ADD_ROW_AFTER = EditorCommands.TABLE_ADD_ROW_AFTER,
    TABLE_ADD_ROW_BEFORE = EditorCommands.TABLE_ADD_ROW_BEFORE,
    TABLE_CELL_COLOR = EditorCommands.TABLE_CELL_COLOR,
    TABLE_DELETE_COLUMN = EditorCommands.TABLE_DELETE_COLUMN,
    TABLE_DELETE_ROW = EditorCommands.TABLE_DELETE_ROW,
    TABLE_DELETE_TABLE = EditorCommands.TABLE_DELETE_TABLE,
    TABLE_INSERT_TABLE = EditorCommands.TABLE_INSERT_TABLE,
    TABLE_MERGE_CELLS = EditorCommands.TABLE_MERGE_CELLS,
    TABLE_MOVE_TO_NEXT_CELL = EditorCommands.TABLE_MOVE_TO_NEXT_CELL,
    TABLE_MOVE_TO_PREV_CELL = EditorCommands.TABLE_MOVE_TO_PREV_CELL,
    TABLE_SPLIT_CELL = EditorCommands.TABLE_SPLIT_CELL,
    TABLE_TOGGLE_HEADER_CELL = EditorCommands.TABLE_TOGGLE_HEADER_CELL,
    TABLE_TOGGLE_HEADER_COLUMN = EditorCommands.TABLE_TOGGLE_HEADER_COLUMN,
    TABLE_TOGGLE_HEADER_ROW = EditorCommands.TABLE_TOGGLE_HEADER_ROW,
    TEXT_ALIGN_CENTER = EditorCommands.TEXT_ALIGN_CENTER,
    TEXT_ALIGN_JUSTIFY = EditorCommands.TEXT_ALIGN_JUSTIFY,
    TEXT_ALIGN_LEFT = EditorCommands.TEXT_ALIGN_LEFT,
    TEXT_ALIGN_RIGHT = EditorCommands.TEXT_ALIGN_RIGHT,
    TEXT_COLOR = EditorCommands.TEXT_COLOR,
    TEXT_HIGHLIGHT = EditorCommands.TEXT_HIGHLIGHT,
    TEXT_LINE_SPACINGS = EditorCommands.TEXT_LINE_SPACINGS,
    UL = EditorCommands.UL,
    UNDERLINE = EditorCommands.UNDERLINE;


var CommandGroups = [{
  undo: HISTORY_UNDO,
  redo: HISTORY_REDO,
  print: PRINT
}, {
  grid_on: [{
    'Insert Table...': TABLE_INSERT_TABLE
  }, {
    'Fill Color...': TABLE_CELL_COLOR
  }, {
    'Insert Column Before': TABLE_ADD_COLUMN_BEFORE,
    'Insert Column After': TABLE_ADD_COLUMN_AFTER,
    'Delete Column': TABLE_DELETE_COLUMN
  }, {
    'Insert Row Before': TABLE_ADD_ROW_BEFORE,
    'Insert Row After': TABLE_ADD_ROW_AFTER,
    'Delete Row': TABLE_DELETE_ROW
  }, {
    'Merge Cells': TABLE_MERGE_CELLS,
    'Split Cells': TABLE_SPLIT_CELL
  },
  // Disable these commands cause user rarely use them.
  {
    'Toggle Header Column': TABLE_TOGGLE_HEADER_COLUMN,
    'Toggle Header Cow': TABLE_TOGGLE_HEADER_ROW,
    'Toggle Header Cells': TABLE_TOGGLE_HEADER_CELL
  }, {
    'Delete Table': TABLE_DELETE_TABLE
  }]
}, {
  'H1 ': H1,
  'H2 ': H2,
  'keyboard_arrow_down': [{
    'Header 3': H3,
    'Header 4': H4,
    'Header 5': H5,
    'Header 6': H6
  }]
}, {
  font_download: _FontTypeCommandMenuButton2.default
}, {
  format_size: _FontSizeCommandMenuButton2.default
}, {
  format_bold: STRONG,
  format_italic: EM,
  format_underline: UNDERLINE,
  format_color_text: TEXT_COLOR,
  border_color: TEXT_HIGHLIGHT
}, {
  link: LINK_SET_URL,
  // comment: COMMENT,
  image: IMAGE_FROM_URL
}, {
  format_align_left: TEXT_ALIGN_LEFT,
  format_align_center: TEXT_ALIGN_CENTER,
  format_align_right: TEXT_ALIGN_RIGHT,
  format_align_justify: TEXT_ALIGN_JUSTIFY
}, {
  format_line_spacing: TEXT_LINE_SPACINGS
}, {
  format_list_numbered: OL,
  format_list_bulleted: UL
}, {
  format_indent_increase: INDENT_MORE,
  format_indent_decrease: INDENT_LESS
}, {
  format_clear: CLEAR_FORMAT
}, {
  hr: HR,
  code: CODE,
  format_strikethrough: STRIKE,
  format_quote: BLOCKQUOTE_INFO
}];

var EditorToolbar = function (_React$PureComponent) {
  (0, _inherits3.default)(EditorToolbar, _React$PureComponent);

  function EditorToolbar() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, EditorToolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = EditorToolbar.__proto__ || (0, _getPrototypeOf2.default)(EditorToolbar)).call.apply(_ref, [this].concat(args))), _this), _this._ref = null, _this.state = {
      wrapped: false
    }, _this._renderButtonsGroup = function (group, index) {
      var buttons = (0, _keys2.default)(group).map(function (label) {
        var obj = group[label];

        if ((0, _isReactClass2.default)(obj)) {
          // JSX requies the component to be named with upper camel case.
          var ThatComponent = obj;
          var _this$props = _this.props,
              _editorState = _this$props.editorState,
              _editorView = _this$props.editorView;

          return _react2.default.createElement(ThatComponent, {
            dispatch: _this._dispatchTransaction,
            editorState: _editorState,
            editorView: _editorView,
            key: label
          });
        } else if (obj instanceof _UICommand2.default) {
          return _this._renderButton(label, obj);
        } else if (Array.isArray(obj)) {
          return _this._renderMenuButton(label, obj);
        } else {
          return null;
        }
      }).filter(Boolean);
      return _react2.default.createElement(
        'div',
        { key: 'g' + String(index), className: 'czi-custom-buttons' },
        buttons
      );
    }, _this._renderMenuButton = function (label, commandGroups) {
      var _this$props2 = _this.props,
          editorState = _this$props2.editorState,
          editorView = _this$props2.editorView,
          disabled = _this$props2.disabled;

      var icon = ICON_LABEL_PATTERN.test(label) ? _react2.default.createElement(_Icon2.default, { type: label }) : null;
      return _react2.default.createElement(_CommandMenuButton2.default, {
        commandGroups: commandGroups,
        disabled: disabled,
        dispatch: _this._dispatchTransaction,
        editorState: editorState || EDITOR_EMPTY_STATE,
        editorView: editorView,
        icon: icon,
        key: label,
        label: icon ? null : label
      });
    }, _this._renderButton = function (label, command) {
      var _this$props3 = _this.props,
          disabled = _this$props3.disabled,
          editorState = _this$props3.editorState,
          editorView = _this$props3.editorView;

      var icon = void 0;
      if (ICON_LABEL_PATTERN.test(label)) {
        icon = _react2.default.createElement(_Icon2.default, { type: label });
      }
      return _react2.default.createElement(_CommandButton2.default, {
        command: command,
        disabled: disabled,
        dispatch: _this._dispatchTransaction,
        editorState: editorState || EDITOR_EMPTY_STATE,
        editorView: editorView,
        icon: icon,
        key: label,
        label: icon ? null : label
      });
    }, _this._dispatchTransaction = function (transaction) {
      var _this$props4 = _this.props,
          onChange = _this$props4.onChange,
          editorState = _this$props4.editorState;

      var nextState = (editorState || EDITOR_EMPTY_STATE).apply(transaction);
      onChange && onChange(nextState);
    }, _this._onRef = function (ref) {
      _this._ref = ref;

      if (ref) {
        // Mounting
        var el = _reactDom2.default.findDOMNode(ref);
        if (el instanceof HTMLElement) {
          _ResizeObserver2.default.observe(el, _this._onContentResize);
        }
      } else {
        // Unmounting.
        var _el = _reactDom2.default.findDOMNode(_this._ref);
        if (_el instanceof HTMLElement) {
          _ResizeObserver2.default.unobserve(_el);
        }
      }
      _this._ref = ref;
    }, _this._onContentResize = function (info) {
      var ref = _this._ref;
      var el = ref && _reactDom2.default.findDOMNode(ref);
      var body = el && el.firstChild;
      if (el && body) {
        _this.setState({
          wrapped: body.offsetHeight >= el.offsetHeight * 1.5
        });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(EditorToolbar, [{
    key: 'render',
    value: function render() {
      var wrapped = this.state.wrapped;

      var className = (0, _classnames2.default)('czi-editor-toolbar', { wrapped: wrapped });
      return _react2.default.createElement(
        'div',
        { className: className, ref: this._onRef },
        _react2.default.createElement(
          'div',
          { className: 'czi-editor-toolbar-body' },
          CommandGroups.map(this._renderButtonsGroup)
        )
      );
    }
  }]);
  return EditorToolbar;
}(_react2.default.PureComponent);

exports.default = EditorToolbar;