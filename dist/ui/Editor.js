'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_NODE_VIEWS = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _freeze = require('babel-runtime/core-js/object/freeze');

var _freeze2 = _interopRequireDefault(_freeze);

var _Object$freeze2;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _webfontloader = require('webfontloader');

var _webfontloader2 = _interopRequireDefault(_webfontloader);

require('prosemirror-gapcursor/style/gapcursor.css');

require('prosemirror-view/style/prosemirror.css');

var _CZIProseMirror = require('../CZIProseMirror');

var _NodeNames = require('../NodeNames');

var _WebFontLoader = require('../WebFontLoader');

var _WebFontLoader2 = _interopRequireDefault(_WebFontLoader);

var _createEmptyEditorState = require('../createEmptyEditorState');

var _createEmptyEditorState2 = _interopRequireDefault(_createEmptyEditorState);

var _normalizeHTML = require('../normalizeHTML');

var _normalizeHTML2 = _interopRequireDefault(_normalizeHTML);

var _BookmarkNodeView = require('./BookmarkNodeView');

var _BookmarkNodeView2 = _interopRequireDefault(_BookmarkNodeView);

var _CustomEditorView = require('./CustomEditorView');

var _CustomEditorView2 = _interopRequireDefault(_CustomEditorView);

var _CustomNodeView = require('./CustomNodeView');

var _CustomNodeView2 = _interopRequireDefault(_CustomNodeView);

var _ImageNodeView = require('./ImageNodeView');

var _ImageNodeView2 = _interopRequireDefault(_ImageNodeView);

var _MathNodeView = require('./MathNodeView');

var _MathNodeView2 = _interopRequireDefault(_MathNodeView);

var _handleEditorDrop = require('./handleEditorDrop');

var _handleEditorDrop2 = _interopRequireDefault(_handleEditorDrop);

var _handleEditorKeyDown = require('./handleEditorKeyDown');

var _handleEditorKeyDown2 = _interopRequireDefault(_handleEditorKeyDown);

var _handleEditorPaste = require('./handleEditorPaste');

var _handleEditorPaste2 = _interopRequireDefault(_handleEditorPaste);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

require('./czi-editor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_EditorRuntime = require('../Types').babelPluginFlowReactPropTypes_proptype_EditorRuntime || require('prop-types').any;

// Export utilities for debugging.
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_EditorProps', {
  value: require('prop-types').shape({
    autoFocus: require('prop-types').bool,
    disabled: require('prop-types').bool,
    dispatchTransaction: require('prop-types').func,
    editorState: require('prop-types').any,
    embedded: require('prop-types').bool,
    onBlur: require('prop-types').func,
    onChange: require('prop-types').func,
    onReady: require('prop-types').func,
    nodeViews: require('prop-types').shape({}),
    placeholder: require('prop-types').oneOfType([require('prop-types').string, require('prop-types').any]),
    readOnly: require('prop-types').bool,
    runtime: babelPluginFlowReactPropTypes_proptype_EditorRuntime,
    transformPastedHTML: require('prop-types').func
  })
});
window.CZIProseMirror = {
  exportJSON: _CZIProseMirror.exportJSON,
  registeryKeys: _CZIProseMirror.registeryKeys
};

var AUTO_FOCUS_DELAY = 350;

// Default custom node views.
var DEFAULT_NODE_VIEWS = exports.DEFAULT_NODE_VIEWS = (0, _freeze2.default)((_Object$freeze2 = {}, (0, _defineProperty3.default)(_Object$freeze2, _NodeNames.IMAGE, _ImageNodeView2.default), (0, _defineProperty3.default)(_Object$freeze2, _NodeNames.MATH, _MathNodeView2.default), (0, _defineProperty3.default)(_Object$freeze2, _NodeNames.BOOKMARK, _BookmarkNodeView2.default), _Object$freeze2));

var EDITOR_EMPTY_STATE = (0, _freeze2.default)((0, _createEmptyEditorState2.default)());

// Monkey patch the `scrollIntoView` mathod of 'Transaction'.
// Why this is necessary?
// It appears that promse-mirror does call `scrollIntoView` extensively
// from many of the built-in transformations, thus cause unwanted page
// scrolls. To make the behavior more manageable, this patched method asks
// developer to explicitly use `scrollIntoView(true)` to enforce page scroll.
var scrollIntoView = _prosemirrorState.Transaction.prototype.scrollIntoView;
var scrollIntoViewPatched = function scrollIntoViewPatched(forced) {
  if (forced === true && scrollIntoView) {
    return scrollIntoView.call(this);
  } else {
    return this;
  }
};
_prosemirrorState.Transaction.prototype.scrollIntoView = scrollIntoViewPatched;

// Sets the implementation so that `FontTypeMarkSpec` can load custom fonts.
_WebFontLoader2.default.setImplementation(_webfontloader2.default);

var handleDOMEvents = {
  drop: _handleEditorDrop2.default,
  keydown: _handleEditorKeyDown2.default,
  paste: _handleEditorPaste2.default
};

function bindNodeView(NodeView) {
  return function (node, view, getPos, decorations) {
    return new NodeView(node, view, getPos, decorations);
  };
}

function getSchema(editorState) {
  return editorState ? editorState.schema : EDITOR_EMPTY_STATE.schema;
}

var Editor = function (_React$PureComponent) {
  (0, _inherits3.default)(Editor, _React$PureComponent);

  function Editor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Editor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Editor.__proto__ || (0, _getPrototypeOf2.default)(Editor)).call.apply(_ref, [this].concat(args))), _this), _this._autoFocusTimer = 0, _this._id = (0, _uuid2.default)(), _this._editorView = null, _this.state = {
      isPrinting: false
    }, _this._onBlur = function () {
      var onBlur = _this.props.onBlur;

      var view = _this._editorView;
      if (view && !view.disabled && !view.readOnly && onBlur) {
        onBlur();
      }
    }, _this.focus = function () {
      var view = _this._editorView;
      if (view && !view.disabled && !view.readOnly) {
        view.focus();
      }
    }, _this._isEditable = function () {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          readOnly = _this$props.readOnly;
      var isPrinting = _this.state.isPrinting;

      return !isPrinting && !!_this._editorView && !readOnly && !disabled;
    }, _this._onPrintStart = function () {
      _this.setState({ isPrinting: true });
    }, _this._onPrintEnd = function () {
      _this.setState({ isPrinting: false });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Editor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          onReady = _props.onReady,
          editorState = _props.editorState,
          readOnly = _props.readOnly,
          runtime = _props.runtime,
          placeholder = _props.placeholder,
          disabled = _props.disabled,
          dispatchTransaction = _props.dispatchTransaction,
          nodeViews = _props.nodeViews,
          transformPastedHTML = _props.transformPastedHTML;


      var editorNode = document.getElementById(this._id);
      if (editorNode) {
        var effectiveNodeViews = (0, _assign2.default)({}, DEFAULT_NODE_VIEWS, nodeViews);
        var boundNodeViews = {};
        var schema = getSchema(editorState);
        var nodes = schema.nodes;


        (0, _keys2.default)(effectiveNodeViews).forEach(function (nodeName) {
          var nodeView = effectiveNodeViews[nodeName];
          // Only valid and supported node views should be used.
          if (nodes[nodeName]) {
            boundNodeViews[nodeName] = bindNodeView(nodeView);
          }
        });

        // Reference: http://prosemirror.net/examples/basic/
        var _view = this._editorView = new _CustomEditorView2.default(editorNode, {
          clipboardSerializer: _prosemirrorModel.DOMSerializer.fromSchema(schema),
          dispatchTransaction: dispatchTransaction,
          editable: this._isEditable,
          nodeViews: boundNodeViews,
          state: editorState || EDITOR_EMPTY_STATE,
          transformPastedHTML: transformPastedHTML,
          handleDOMEvents: handleDOMEvents
        });

        _view.runtime = runtime;
        _view.placeholder = placeholder;
        _view.readOnly = !!readOnly;
        _view.disabled = !!disabled;
        _view.updateState(editorState || EDITOR_EMPTY_STATE);

        // Expose the view to CZIProseMirror so developer could debug it.
        (0, _CZIProseMirror.registerEditorView)(this._id, _view);

        onReady && onReady(_view);

        this._autoFocusTimer && clearTimeout(this._autoFocusTimer);
        this._autoFocusTimer = this.props.autoFocus ? setTimeout(this.focus, AUTO_FOCUS_DELAY) : 0;
      }

      window.addEventListener('beforeprint', this._onPrintStart, false);
      window.addEventListener('afterprint', this._onPrintEnd, false);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var view = this._editorView;
      if (view) {
        var prevSchema = getSchema(prevProps.editorState);
        var currSchema = getSchema(this.props.editorState);
        if (prevSchema !== currSchema) {
          // schema should never change.
          // TODO: re-create the editor view if schema changed.
          console.error('editor schema changed.');
        }

        var _props2 = this.props,
            _runtime = _props2.runtime,
            _editorState = _props2.editorState,
            _placeholder = _props2.placeholder,
            _readOnly = _props2.readOnly,
            _disabled = _props2.disabled;
        var isPrinting = this.state.isPrinting;

        var _state = _editorState || EDITOR_EMPTY_STATE;
        view.runtime = _runtime;
        view.placeholder = _placeholder;
        view.readOnly = !!_readOnly || isPrinting;
        view.disabled = !!_disabled;
        view.updateState(_state);

        this._autoFocusTimer && clearTimeout(this._autoFocusTimer);
        this._autoFocusTimer = !prevProps.autoFocus && this.props.autoFocus ? setTimeout(this.focus, AUTO_FOCUS_DELAY) : 0;
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._editorView && this._editorView.destroy();
      this._editorView = null;
      (0, _CZIProseMirror.releaseEditorView)(this._id);
      window.removeEventListener('beforeprint', this._onPrintStart, false);
      window.removeEventListener('afterprint', this._onPrintEnd, false);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          embedded = _props3.embedded,
          readOnly = _props3.readOnly;

      var className = (0, _classnames2.default)('prosemirror-editor-wrapper', { embedded: embedded, readOnly: readOnly });
      return _react2.default.createElement('div', {
        className: className,
        'data-czi-prosemirror-editor-id': this._id,
        id: this._id,
        onBlur: this._onBlur
      });
    }
  }]);
  return Editor;
}(_react2.default.PureComponent);

Editor.EDITOR_EMPTY_STATE = EDITOR_EMPTY_STATE;
Editor.defaultProps = {
  transformPastedHTML: _normalizeHTML2.default
};
exports.default = Editor;