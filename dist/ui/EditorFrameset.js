'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _require$shape;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./czi-editor-frameset.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_EditorFramesetProps', {
  value: require('prop-types').shape((_require$shape = {
    body: require('prop-types').any,
    className: require('prop-types').string,
    embedded: require('prop-types').bool,
    header: require('prop-types').any
  }, (0, _defineProperty3.default)(_require$shape, 'header', require('prop-types').any), (0, _defineProperty3.default)(_require$shape, 'height', require('prop-types').oneOfType([require('prop-types').string, require('prop-types').number])), (0, _defineProperty3.default)(_require$shape, 'toolbar', require('prop-types').any), (0, _defineProperty3.default)(_require$shape, 'toolbar', require('prop-types').any), (0, _defineProperty3.default)(_require$shape, 'width', require('prop-types').oneOfType([require('prop-types').string, require('prop-types').number])), _require$shape))
});


function toCSS(val) {
  if (typeof val === 'number') {
    return val + 'px';
  }
  if (val === undefined || val === null) {
    return 'auto';
  }
  return String(val);
}

var EditorFrameset = function (_React$PureComponent) {
  (0, _inherits3.default)(EditorFrameset, _React$PureComponent);

  function EditorFrameset() {
    (0, _classCallCheck3.default)(this, EditorFrameset);
    return (0, _possibleConstructorReturn3.default)(this, (EditorFrameset.__proto__ || (0, _getPrototypeOf2.default)(EditorFrameset)).apply(this, arguments));
  }

  (0, _createClass3.default)(EditorFrameset, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          body = _props.body,
          className = _props.className,
          embedded = _props.embedded,
          header = _props.header,
          height = _props.height,
          toolbar = _props.toolbar,
          width = _props.width;


      var useFixedLayout = width !== undefined || height !== undefined;

      var mainClassName = (0, _classnames2.default)(className, {
        'czi-editor-frameset': true,
        'with-fixed-layout': useFixedLayout,
        'embedded': embedded
      });

      var mainStyle = {
        width: toCSS(width === undefined && useFixedLayout ? 'auto' : width),
        height: toCSS(height === undefined && useFixedLayout ? 'auto' : height)
      };

      return _react2.default.createElement(
        'div',
        { className: mainClassName, style: mainStyle },
        _react2.default.createElement(
          'div',
          { className: 'czi-editor-frame-main' },
          _react2.default.createElement(
            'div',
            { className: 'czi-editor-frame-head' },
            header,
            toolbar
          ),
          _react2.default.createElement(
            'div',
            { className: 'czi-editor-frame-body' },
            _react2.default.createElement(
              'div',
              { className: 'czi-editor-frame-body-scroll' },
              body
            )
          ),
          _react2.default.createElement('div', { className: 'czi-editor-frame-footer' })
        )
      );
    }
  }]);
  return EditorFrameset;
}(_react2.default.PureComponent);

exports.default = EditorFrameset;