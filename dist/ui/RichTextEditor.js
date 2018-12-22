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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _createEmptyEditorState = require('../createEmptyEditorState');

var _createEmptyEditorState2 = _interopRequireDefault(_createEmptyEditorState);

var _Editor = require('./Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _EditorToolbar = require('./EditorToolbar');

var _EditorToolbar2 = _interopRequireDefault(_EditorToolbar);

var _ResizeObserver = require('./ResizeObserver');

var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);

var _RichTextEditorContentOverflowControl = require('./RichTextEditorContentOverflowControl');

var _RichTextEditorContentOverflowControl2 = _interopRequireDefault(_RichTextEditorContentOverflowControl);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

require('./czi-rte.css');

require('./czi-vars.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_EditorRuntime = require('../Types').babelPluginFlowReactPropTypes_proptype_EditorRuntime || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry = require('./ResizeObserver').babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry || require('prop-types').any;

var EMPTY_EDITOR_STATE = (0, _createEmptyEditorState2.default)();
var EMPTY_EDITOR_RUNTIME = {};

var RichTextEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(RichTextEditor, _React$PureComponent);

  function RichTextEditor(props, context) {
    (0, _classCallCheck3.default)(this, RichTextEditor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (RichTextEditor.__proto__ || (0, _getPrototypeOf2.default)(RichTextEditor)).call(this, props, context));

    _this._onEditorRef = function (ref) {
      if (ref) {
        // Mounting
        var el = _reactDom2.default.findDOMNode(ref);
        if (el instanceof HTMLElement) {
          _ResizeObserver2.default.observe(el, _this._onContentResize);
        }
      } else {
        // Unmounting.
        var _el = _reactDom2.default.findDOMNode(_this._editor);
        if (_el instanceof HTMLElement) {
          _ResizeObserver2.default.unobserve(_el);
        }
      }
      _this._editor = ref;
    };

    _this._onReady = function (editorView) {
      if (editorView !== _this.state.editorView) {
        _this.setState({ editorView: editorView });
        var _onReady = _this.props.onReady;

        _onReady && _onReady(editorView);
      }
    };

    _this._onContentOverflowToggle = function (contentOverflowHidden) {
      _this.setState({
        contentOverflowHidden: contentOverflowHidden
      });
    };

    _this._onContentResize = function (info) {
      _this.setState({
        contentHeight: info.contentRect.height
      });
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

      var useFixedLayout = width !== undefined || height !== undefined;

      var mainClassName = (0, _classnames2.default)(className, {
        'czi-rte': true,
        'with-fixed-layout': useFixedLayout,
        'disabled': disabled,
        'embedded': embedded
      });

      var mainStyle = {
        width: toCSS(width === undefined && useFixedLayout ? 'auto' : width),
        height: toCSS(height === undefined && useFixedLayout ? 'auto' : height)
      };

      var contentOverflowInfo = getContentOverflowInfo(this.props, this.state, this._onContentOverflowToggle);

      var editorView = this.state.editorView;


      var toolbar = !!readOnly === true ? null : _react2.default.createElement(_EditorToolbar2.default, {
        disabled: disabled,
        editorState: editorState,
        editorView: editorView,
        onChange: onChange,
        readOnly: readOnly
      });

      return _react2.default.createElement(
        'div',
        { className: mainClassName, style: mainStyle },
        _react2.default.createElement(
          'div',
          { className: 'czi-rte-frameset' },
          _react2.default.createElement(
            'div',
            { className: 'czi-rte-frame-head' },
            header,
            toolbar
          ),
          _react2.default.createElement(
            'div',
            { className: 'czi-rte-frame-body' },
            _react2.default.createElement(
              'div',
              {
                className: (0, _classnames2.default)('czi-rte-frame-body-scroll', contentOverflowInfo.className),
                style: contentOverflowInfo.style },
              _react2.default.createElement(_Editor2.default, {
                disabled: disabled,
                editorState: editorState,
                embedded: embedded,
                id: this._id,
                onChange: onChange,
                onReady: this._onReady,
                placeholder: placeholder,
                readOnly: readOnly,
                ref: this._onEditorRef,
                runtime: runtime
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'czi-rte-frame-footer' },
            contentOverflowInfo.control
          )
        )
      );
    }
  }]);
  return RichTextEditor;
}(_react2.default.PureComponent);

function getContentOverflowInfo(props, state, onToggle) {
  var maxContentHeight = props.maxContentHeight;
  var contentHeight = state.contentHeight,
      contentOverflowHidden = state.contentOverflowHidden;

  if (contentHeight === null || maxContentHeight === null || maxContentHeight === undefined || contentHeight <= maxContentHeight) {
    // nothing to clamp.
    return {};
  }

  // Content could be clamped.
  var style = contentOverflowHidden ? {
    maxHeight: String(maxContentHeight) + 'px'
  } : null;

  var control = _react2.default.createElement(_RichTextEditorContentOverflowControl2.default, {
    contentOverflowHidden: contentOverflowHidden,
    onToggle: onToggle
  });

  var className = contentOverflowHidden ? 'czi-rte-content-overflow-clamped' : null;

  return {
    style: style,
    control: control,
    className: className
  };
}

getContentOverflowInfo.propTypes = {
  className: require('prop-types').string,
  disabled: require('prop-types').bool,
  editorState: require('prop-types').any,
  embedded: require('prop-types').bool,
  header: require('prop-types').any,
  height: require('prop-types').oneOfType([require('prop-types').string, require('prop-types').number]),
  id: require('prop-types').string,
  maxContentHeight: require('prop-types').number,
  onBlur: require('prop-types').func,
  onChange: require('prop-types').func,
  onReady: require('prop-types').func,
  placeholder: require('prop-types').oneOfType([require('prop-types').string, require('prop-types').any]),
  readOnly: require('prop-types').bool,
  runtime: babelPluginFlowReactPropTypes_proptype_EditorRuntime,
  width: require('prop-types').oneOfType([require('prop-types').string, require('prop-types').number])
};
getContentOverflowInfo.propTypes = {
  className: require('prop-types').string,
  disabled: require('prop-types').bool,
  editorState: require('prop-types').any,
  embedded: require('prop-types').bool,
  header: require('prop-types').any,
  height: require('prop-types').oneOfType([require('prop-types').string, require('prop-types').number]),
  id: require('prop-types').string,
  maxContentHeight: require('prop-types').number,
  onBlur: require('prop-types').func,
  onChange: require('prop-types').func,
  onReady: require('prop-types').func,
  placeholder: require('prop-types').oneOfType([require('prop-types').string, require('prop-types').any]),
  readOnly: require('prop-types').bool,
  runtime: babelPluginFlowReactPropTypes_proptype_EditorRuntime,
  width: require('prop-types').oneOfType([require('prop-types').string, require('prop-types').number])
};
function toCSS(val) {
  if (typeof val === 'number') {
    return val + 'px';
  }
  if (val === undefined || val === null) {
    return 'auto';
  }
  return String(val);
}

exports.default = RichTextEditor;