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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLoadable = require('react-loadable');

var _reactLoadable2 = _interopRequireDefault(_reactLoadable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MathQuillEditorShimmer = function (_React$PureComponent) {
  (0, _inherits3.default)(MathQuillEditorShimmer, _React$PureComponent);

  function MathQuillEditorShimmer() {
    (0, _classCallCheck3.default)(this, MathQuillEditorShimmer);
    return (0, _possibleConstructorReturn3.default)(this, (MathQuillEditorShimmer.__proto__ || (0, _getPrototypeOf2.default)(MathQuillEditorShimmer)).apply(this, arguments));
  }

  (0, _createClass3.default)(MathQuillEditorShimmer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'czi-mathquill-editor' },
        _react2.default.createElement('div', { className: 'czi-mathquill-editor-main' }),
        _react2.default.createElement('div', { className: 'czi-mathquill-editor-side' })
      );
    }
  }]);
  return MathQuillEditorShimmer;
}(_react2.default.PureComponent);

var MathQuillEditorLoadable = (0, _reactLoadable2.default)({
  loader: function loader() {
    return import( /* webpackChunkName: "czi_prosemirror_mathquill_editor" */'./MathQuillEditor');
  },
  loading: function loading() {
    return _react2.default.createElement(MathQuillEditorShimmer, null);
  }
});

exports.default = MathQuillEditorLoadable;