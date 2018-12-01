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

require('./czi-mathquill-editor.css');

var _MathQuillEditorSymbols = require('./MathQuillEditorSymbols');

var MathQuillEditorSymbols = _interopRequireWildcard(_MathQuillEditorSymbols);

var _mathquill = require('node-mathquill/build/mathquill.js');

var _mathquill2 = _interopRequireDefault(_mathquill);

var _MathQuillEditorSymbolsPanel = require('./MathQuillEditorSymbolsPanel');

var _MathQuillEditorSymbolsPanel2 = _interopRequireDefault(_MathQuillEditorSymbolsPanel);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MathQuillEditorSymbol = require('./MathQuillEditorSymbols').babelPluginFlowReactPropTypes_proptype_MathQuillEditorSymbol || require('prop-types').any;

var MQ = _mathquill2.default.getInterface(2);

var MathQuillElement = function (_React$Component) {
  (0, _inherits3.default)(MathQuillElement, _React$Component);

  function MathQuillElement() {
    (0, _classCallCheck3.default)(this, MathQuillElement);
    return (0, _possibleConstructorReturn3.default)(this, (MathQuillElement.__proto__ || (0, _getPrototypeOf2.default)(MathQuillElement)).apply(this, arguments));
  }

  (0, _createClass3.default)(MathQuillElement, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        className: 'czi-mathquill-editor-element',
        dangerouslySetInnerHTML: { __html: this.props.value }
      });
    }
  }]);
  return MathQuillElement;
}(_react2.default.Component);

var MathQuillEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(MathQuillEditor, _React$PureComponent);

  function MathQuillEditor() {
    var _ref;

    var _temp, _this2, _ret;

    (0, _classCallCheck3.default)(this, MathQuillEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref = MathQuillEditor.__proto__ || (0, _getPrototypeOf2.default)(MathQuillEditor)).call.apply(_ref, [this].concat(args))), _this2), _this2._element = null, _this2._ignoreEditEvents = 4, _this2._mathField = null, _this2._latex = '', _this2._renderPanel = function (symbols, ii) {
      return _react2.default.createElement(_MathQuillEditorSymbolsPanel2.default, {
        key: 's' + ii,
        onSelect: _this2._onSymbolSelect,
        symbols: symbols
      });
    }, _this2._onSymbolSelect = function (symbol) {
      var latex = symbol.latex,
          cmd = symbol.cmd;

      var mathField = _this2._mathField;
      if (!mathField || !cmd || !latex) {
        return;
      }
      if (cmd === 'write') {
        mathField.write(latex);
      } else if (cmd === 'cmd') {
        mathField.cmd(latex);
      }
      mathField.focus();
    }, _this2._onEdit = function (mathField) {
      if (_this2._ignoreEditEvents > 0) {
        _this2._ignoreEditEvents -= 1;
        return;
      }

      var onChange = _this2.props.onChange;

      var latex = mathField.latex();
      _this2._latex = latex;
      onChange && onChange(latex);
    }, _this2._onElementRef = function (ref) {
      if (ref) {
        _this2._element = _reactDom2.default.findDOMNode(ref);
      } else {
        _this2._element = null;
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this2, _ret);
  }

  // MathJax apparently fire 4 edit events on startup.


  (0, _createClass3.default)(MathQuillEditor, [{
    key: 'render',
    value: function render() {
      var value = this.props.value;

      var panels = [MathQuillEditorSymbols.OPERATORS, MathQuillEditorSymbols.STRUCTURE, MathQuillEditorSymbols.SYMBOLS, MathQuillEditorSymbols.TRIG, MathQuillEditorSymbols.VARIABLES].map(this._renderPanel);

      var empty = !value;
      var className = (0, _classnames2.default)('czi-mathquill-editor', { empty: empty });
      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(
          'div',
          { className: 'czi-mathquill-editor-main' },
          _react2.default.createElement(MathQuillElement, {
            ref: this._onElementRef
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'czi-mathquill-editor-side' },
          panels
        )
      );
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var mathField = this._mathField;
      if (this._latex !== this.props.value && mathField) {
        mathField.latex(this.props.value || ' ');
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var config = {
        autoCommands: 'pi theta sqrt sum',
        autoOperatorNames: 'sin cos',
        restrictMismatchedBrackets: true,
        handlers: {
          edit: this._onEdit
        }
      };

      var mathField = MQ.MathField(this._element, config);
      this._mathField = mathField;
      mathField.latex(this.props.value || ' ');
    }
  }]);
  return MathQuillEditor;
}(_react2.default.PureComponent);

exports.default = MathQuillEditor;