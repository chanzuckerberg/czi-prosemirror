'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CustomNodeView2 = require('./CustomNodeView');

var _CustomNodeView3 = _interopRequireDefault(_CustomNodeView2);

require('./czi-pagebreak-view.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_NodeViewProps = require('./CustomNodeView').babelPluginFlowReactPropTypes_proptype_NodeViewProps || require('prop-types').any;

var PageBreakView = function (_React$PureComponent) {
  (0, _inherits3.default)(PageBreakView, _React$PureComponent);

  function PageBreakView() {
    (0, _classCallCheck3.default)(this, PageBreakView);
    return (0, _possibleConstructorReturn3.default)(this, (PageBreakView.__proto__ || (0, _getPrototypeOf2.default)(PageBreakView)).apply(this, arguments));
  }

  (0, _createClass3.default)(PageBreakView, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'pagebreak-container' },
        _react2.default.createElement('hr', { className: 'pagebreak-hr' }),
        _react2.default.createElement(
          'p',
          { className: 'pagebreak-description' },
          'This is a manually inserted page break. This text will not appear when the page is printed.'
        ),
        _react2.default.createElement('hr', { className: 'pagebreak-hr' })
      );
    }
  }]);
  return PageBreakView;
}(_react2.default.PureComponent);

var PageBreakNodeView = function (_CustomNodeView) {
  (0, _inherits3.default)(PageBreakNodeView, _CustomNodeView);

  function PageBreakNodeView() {
    (0, _classCallCheck3.default)(this, PageBreakNodeView);
    return (0, _possibleConstructorReturn3.default)(this, (PageBreakNodeView.__proto__ || (0, _getPrototypeOf2.default)(PageBreakNodeView)).apply(this, arguments));
  }

  (0, _createClass3.default)(PageBreakNodeView, [{
    key: 'createDOMElement',

    // @override
    value: function createDOMElement() {
      var el = document.createElement('div');
      el.className = 'czi-pagebreak-view';
      return el;
    }

    // @override

  }, {
    key: 'update',
    value: function update(node, decorations) {
      (0, _get3.default)(PageBreakNodeView.prototype.__proto__ || (0, _getPrototypeOf2.default)(PageBreakNodeView.prototype), 'update', this).call(this, node, decorations);
      return true;
    }

    // @override

  }, {
    key: 'renderReactComponent',
    value: function renderReactComponent() {
      return _react2.default.createElement(PageBreakView, this.props);
    }
  }]);
  return PageBreakNodeView;
}(_CustomNodeView3.default);

exports.default = PageBreakNodeView;