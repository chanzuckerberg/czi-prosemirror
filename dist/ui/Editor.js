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

require('./czi-editor.css');

require('prosemirror-gapcursor/style/gapcursor.css');

require('prosemirror-view/style/prosemirror.css');

var _CustomEditorView = require('./CustomEditorView');

var _CustomEditorView2 = _interopRequireDefault(_CustomEditorView);

var _ImageNodeView = require('./ImageNodeView');

var _ImageNodeView2 = _interopRequireDefault(_ImageNodeView);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _prosemirrorDevTools = require('prosemirror-dev-tools');

var _prosemirrorDevTools2 = _interopRequireDefault(_prosemirrorDevTools);

var _createEmptyEditorState = require('../createEmptyEditorState');

var _createEmptyEditorState2 = _interopRequireDefault(_createEmptyEditorState);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EDITOR_EMPTY_STATE = (0, _createEmptyEditorState2.default)();

var Editor = function (_React$PureComponent) {
  (0, _inherits3.default)(Editor, _React$PureComponent);

  function Editor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Editor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Editor.__proto__ || (0, _getPrototypeOf2.default)(Editor)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _uuid2.default)(), _this._editorView = null, _this._dispatchTransaction = function (transaction) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          editorState = _this$props.editorState,
          readOnly = _this$props.readOnly;

      if (readOnly === true) {
        return;
      }
      var nextState = (editorState || EDITOR_EMPTY_STATE).apply(transaction);
      onChange && onChange(nextState);
    }, _this._isEditable = function () {
      return !!_this._editorView && !!_this.props.readOnly !== true;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Editor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          onReady = _props.onReady,
          editorState = _props.editorState,
          readOnly = _props.readOnly;

      var editorNode = document.getElementById(this._id);
      var templateNode = document.getElementById(this._id + 'template');

      if (editorNode) {
        var runtime = {
          hello: function hello() {
            return console.log(123);
          }
        };

        // Reference: http://prosemirror.net/examples/basic/
        var _view = this._editorView = new _CustomEditorView2.default(editorNode, {
          state: editorState || EDITOR_EMPTY_STATE,
          dispatchTransaction: this._dispatchTransaction,
          editable: this._isEditable,
          nodeViews: {
            image: function image(node, view, getPos) {
              return new _ImageNodeView2.default(node, view, getPos);
            }
          }
        }, runtime);

        onReady && onReady(this._editorView);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var view = this._editorView;
      if (view) {
        var _state = this.props.editorState || EDITOR_EMPTY_STATE;
        view.updateState(_state);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._editorView && this._editorView.destroy();
      this._editorView = null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { id: this._id, className: 'prosemirror-editor-wrapper' });
    }
  }, {
    key: 'focus',
    value: function focus() {
      this._editorView && this._editorView.focus();
    }
  }]);
  return Editor;
}(_react2.default.PureComponent);

exports.default = Editor;