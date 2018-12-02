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

var _renderLaTeXAsHTML = require('../renderLaTeXAsHTML');

var _renderLaTeXAsHTML2 = _interopRequireDefault(_renderLaTeXAsHTML);

require('./czi-mathquill-editor-symbols-panel.css');

var _CustomButton = require('../CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MathQuillEditorSymbol = require('./MathQuillEditorSymbols').babelPluginFlowReactPropTypes_proptype_MathQuillEditorSymbol || require('prop-types').any;

var MathQuillEditorSymbolsPanel = function (_React$PureComponent) {
  (0, _inherits3.default)(MathQuillEditorSymbolsPanel, _React$PureComponent);

  function MathQuillEditorSymbolsPanel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MathQuillEditorSymbolsPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MathQuillEditorSymbolsPanel.__proto__ || (0, _getPrototypeOf2.default)(MathQuillEditorSymbolsPanel)).call.apply(_ref, [this].concat(args))), _this), _this._renderButton = function (symbol) {
      var label = symbol.label,
          latex = symbol.latex,
          description = symbol.description;

      var html = (0, _renderLaTeXAsHTML2.default)(label);
      var icon = _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: html } });
      return _react2.default.createElement(_CustomButton2.default, {
        className: 'czi-mathquill-editor-symbols-panel-button',
        icon: icon,
        key: label + latex,
        onClick: _this.props.onSelect,
        title: description,
        value: symbol
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(MathQuillEditorSymbolsPanel, [{
    key: 'render',
    value: function render() {
      var _props$symbols = this.props.symbols,
          title = _props$symbols.title,
          symbols = _props$symbols.symbols;

      var buttons = symbols.map(this._renderButton);
      return _react2.default.createElement(
        'div',
        { className: 'czi-mathquill-editor-symbols-panel' },
        _react2.default.createElement(
          'div',
          { className: 'czi-mathquill-editor-symbols-panel-title' },
          title
        ),
        _react2.default.createElement(
          'div',
          { className: 'czi-mathquill-editor-symbols-panel-body' },
          buttons
        )
      );
    }
  }]);
  return MathQuillEditorSymbolsPanel;
}(_react2.default.PureComponent);

exports.default = MathQuillEditorSymbolsPanel;