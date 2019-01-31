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

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createEmptyEditorState = require('../createEmptyEditorState');

var _createEmptyEditorState2 = _interopRequireDefault(_createEmptyEditorState);

var _Editor = require('./Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _EditorFrameset = require('./EditorFrameset');

var _EditorFrameset2 = _interopRequireDefault(_EditorFrameset);

var _EditorToolbar = require('./EditorToolbar');

var _EditorToolbar2 = _interopRequireDefault(_EditorToolbar);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_EditorFramesetProps = require('./EditorFrameset').babelPluginFlowReactPropTypes_proptype_EditorFramesetProps || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_EditorProps = require('./Editor').babelPluginFlowReactPropTypes_proptype_EditorProps || require('prop-types').any;

var EMPTY_EDITOR_STATE = (0, _createEmptyEditorState2.default)();
var EMPTY_EDITOR_RUNTIME = {};

var RichTextEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(RichTextEditor, _React$PureComponent);

  function RichTextEditor(props, context) {
    (0, _classCallCheck3.default)(this, RichTextEditor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (RichTextEditor.__proto__ || (0, _getPrototypeOf2.default)(RichTextEditor)).call(this, props, context));

    _this._dispatchTransaction = function (tr) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          editorState = _this$props.editorState,
          readOnly = _this$props.readOnly;

      if (readOnly === true) {
        return;
      }

      if (onChange) {
        var nextState = (editorState || _Editor2.default.EDITOR_EMPTY_STATE).apply(tr);
        onChange(nextState);
      }
    };

    _this._onReady = function (editorView) {
      if (editorView !== _this.state.editorView) {
        _this.setState({ editorView: editorView });
        var onReady = _this.props.onReady;

        onReady && onReady(editorView);
      }
    };

    _this._id = (0, _uuid2.default)();
    _this.state = {
      contentHeight: NaN,
      contentOverflowHidden: false,
      editorView: null
    };
    return _this;
  }

  (0, _createClass3.default)(RichTextEditor, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          disabled = _props.disabled,
          embedded = _props.embedded,
          header = _props.header,
          height = _props.height,
          onChange = _props.onChange,
          placeholder = _props.placeholder,
          readOnly = _props.readOnly,
          width = _props.width;
      var _props2 = this.props,
          editorState = _props2.editorState,
          runtime = _props2.runtime;


      editorState = editorState || EMPTY_EDITOR_STATE;
      runtime = runtime || EMPTY_EDITOR_RUNTIME;

      var editorView = this.state.editorView;


      var toolbar = !!readOnly === true ? null : _react2.default.createElement(_EditorToolbar2.default, {
        disabled: disabled,
        dispatchTransaction: this._dispatchTransaction,
        editorState: editorState || _Editor2.default.EDITOR_EMPTY_STATE,
        editorView: editorView,
        readOnly: readOnly
      });

      var body = _react2.default.createElement(_Editor2.default, {
        disabled: disabled,
        dispatchTransaction: this._dispatchTransaction,
        editorState: editorState,
        embedded: embedded,
        id: this._id,
        onChange: onChange,
        onReady: this._onReady,
        placeholder: placeholder,
        readOnly: readOnly,
        runtime: runtime
      });

      return _react2.default.createElement(_EditorFrameset2.default, {
        body: body,
        className: className,
        embedded: embedded,
        header: header,
        height: height,
        toolbar: toolbar,
        width: width
      });
    }
  }]);
  return RichTextEditor;
}(_react2.default.PureComponent);

exports.default = RichTextEditor;