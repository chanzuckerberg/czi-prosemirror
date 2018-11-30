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

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

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

var _EditorToolbarConfig = require('./EditorToolbarConfig');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry = require('./ResizeObserver').babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry || require('prop-types').any;

var EDITOR_EMPTY_STATE = (0, _createEmptyEditorState2.default)();

var EditorToolbar = function (_React$PureComponent) {
  (0, _inherits3.default)(EditorToolbar, _React$PureComponent);

  function EditorToolbar() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, EditorToolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = EditorToolbar.__proto__ || (0, _getPrototypeOf2.default)(EditorToolbar)).call.apply(_ref, [this].concat(args))), _this), _this._body = null, _this.state = {
      expanded: false,
      wrapped: null
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

      var _parseLabel = (0, _EditorToolbarConfig.parseLabel)(label),
          icon = _parseLabel.icon,
          title = _parseLabel.title;

      return _react2.default.createElement(_CommandMenuButton2.default, {
        commandGroups: commandGroups,
        disabled: disabled,
        dispatch: _this._dispatchTransaction,
        editorState: editorState || EDITOR_EMPTY_STATE,
        editorView: editorView,
        icon: icon,
        key: label,
        label: icon ? null : title,
        title: title
      });
    }, _this._renderButton = function (label, command) {
      var _this$props3 = _this.props,
          disabled = _this$props3.disabled,
          editorState = _this$props3.editorState,
          editorView = _this$props3.editorView;

      var _parseLabel2 = (0, _EditorToolbarConfig.parseLabel)(label),
          icon = _parseLabel2.icon,
          title = _parseLabel2.title;

      return _react2.default.createElement(_CommandButton2.default, {
        command: command,
        disabled: disabled,
        dispatch: _this._dispatchTransaction,
        editorState: editorState || EDITOR_EMPTY_STATE,
        editorView: editorView,
        icon: icon,
        key: label,
        label: icon ? null : title,
        title: title
      });
    }, _this._dispatchTransaction = function (transaction) {
      var _this$props4 = _this.props,
          onChange = _this$props4.onChange,
          editorState = _this$props4.editorState;

      var nextState = (editorState || EDITOR_EMPTY_STATE).apply(transaction);
      onChange && onChange(nextState);
    }, _this._onBodyRef = function (ref) {
      if (ref) {
        _this._body = ref;
        // Mounting
        var el = _reactDom2.default.findDOMNode(ref);
        if (el instanceof HTMLElement) {
          _ResizeObserver2.default.observe(el, _this._checkIfContentIsWrapped);
        }
      } else {
        // Unmounting.
        var _el = _this._body && _reactDom2.default.findDOMNode(_this._body);
        if (_el instanceof HTMLElement) {
          _ResizeObserver2.default.unobserve(_el);
        }
        _this._body = null;
      }
    }, _this._checkIfContentIsWrapped = function () {
      var ref = _this._body;
      var el = ref && _reactDom2.default.findDOMNode(ref);
      var startAnchor = el && el.firstChild;
      var endAnchor = el && el.lastChild;
      if (startAnchor && endAnchor) {
        var wrapped = startAnchor.offsetTop < endAnchor.offsetTop;
        _this.setState({ wrapped: wrapped });
      }
    }, _this._toggleExpansion = function (expanded) {
      _this.setState({ expanded: !expanded });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(EditorToolbar, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          wrapped = _state.wrapped,
          expanded = _state.expanded;

      var className = (0, _classnames2.default)('czi-editor-toolbar', { expanded: expanded, wrapped: wrapped });
      var wrappedButton = wrapped ? _react2.default.createElement(_CustomButton2.default, {
        active: expanded,
        className: 'czi-editor-toolbar-expand-button',
        icon: _Icon2.default.get('more_horiz'),
        key: 'expand',
        onClick: this._toggleExpansion,
        title: 'More',
        value: expanded
      }) : null;
      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(
          'div',
          { className: 'czi-editor-toolbar-flex' },
          _react2.default.createElement(
            'div',
            { className: 'czi-editor-toolbar-body' },
            _react2.default.createElement(
              'div',
              { className: 'czi-editor-toolbar-body-content', ref: this._onBodyRef },
              _react2.default.createElement('i', { className: 'czi-editor-toolbar-wrapped-anchor' }),
              _EditorToolbarConfig.COMMAND_GROUPS.map(this._renderButtonsGroup),
              _react2.default.createElement(
                'div',
                { className: 'czi-editor-toolbar-background' },
                _react2.default.createElement('div', { className: 'czi-editor-toolbar-background-line' }),
                _react2.default.createElement('div', { className: 'czi-editor-toolbar-background-line' }),
                _react2.default.createElement('div', { className: 'czi-editor-toolbar-background-line' }),
                _react2.default.createElement('div', { className: 'czi-editor-toolbar-background-line' }),
                _react2.default.createElement('div', { className: 'czi-editor-toolbar-background-line' })
              ),
              _react2.default.createElement('i', { className: 'czi-editor-toolbar-wrapped-anchor' })
            ),
            wrappedButton
          ),
          _react2.default.createElement('div', { className: 'czi-editor-toolbar-footer' })
        )
      );
    }
  }]);
  return EditorToolbar;
}(_react2.default.PureComponent);

exports.default = EditorToolbar;