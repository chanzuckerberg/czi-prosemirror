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

var _BookmarkNodeSpec = require('./../BookmarkNodeSpec');

var _CustomNodeView2 = require('./CustomNodeView');

var _CustomNodeView3 = _interopRequireDefault(_CustomNodeView2);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

require('./czi-bookmark-view.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_NodeViewProps = require('./CustomNodeView').babelPluginFlowReactPropTypes_proptype_NodeViewProps || require('prop-types').any;

var BookmarkViewBody = function (_React$PureComponent) {
  (0, _inherits3.default)(BookmarkViewBody, _React$PureComponent);

  function BookmarkViewBody() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, BookmarkViewBody);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = BookmarkViewBody.__proto__ || (0, _getPrototypeOf2.default)(BookmarkViewBody)).call.apply(_ref, [this].concat(args))), _this), _this._onClick = function (e) {
      e.preventDefault();
      var id = _this.props.node.attrs.id;

      var hash = '#' + id;
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(BookmarkViewBody, [{
    key: 'render',
    value: function render() {
      var _props$node$attrs = this.props.node.attrs,
          id = _props$node$attrs.id,
          visible = _props$node$attrs.visible;

      var icon = id && visible ? _Icon2.default.get('bookmark') : null;
      return _react2.default.createElement(
        'span',
        { onClick: this._onClick },
        icon
      );
    }
  }]);
  return BookmarkViewBody;
}(_react2.default.PureComponent);

var BookmarkNodeView = function (_CustomNodeView) {
  (0, _inherits3.default)(BookmarkNodeView, _CustomNodeView);

  function BookmarkNodeView() {
    (0, _classCallCheck3.default)(this, BookmarkNodeView);
    return (0, _possibleConstructorReturn3.default)(this, (BookmarkNodeView.__proto__ || (0, _getPrototypeOf2.default)(BookmarkNodeView)).apply(this, arguments));
  }

  (0, _createClass3.default)(BookmarkNodeView, [{
    key: 'createDOMElement',

    // @override
    value: function createDOMElement() {
      var el = document.createElement('a');
      el.className = 'czi-bookmark-view';
      this._updateDOM(el);
      return el;
    }

    // @override

  }, {
    key: 'update',
    value: function update(node, decorations) {
      (0, _get3.default)(BookmarkNodeView.prototype.__proto__ || (0, _getPrototypeOf2.default)(BookmarkNodeView.prototype), 'update', this).call(this, node, decorations);
      return true;
    }

    // @override

  }, {
    key: 'renderReactComponent',
    value: function renderReactComponent() {
      return _react2.default.createElement(BookmarkViewBody, this.props);
    }
  }, {
    key: '_updateDOM',
    value: function _updateDOM(el) {
      var _props$node$attrs2 = this.props.node.attrs,
          id = _props$node$attrs2.id,
          visible = _props$node$attrs2.visible;

      el.setAttribute('id', id);
      el.setAttribute('title', id);
      el.setAttribute(_BookmarkNodeSpec.ATTRIBUTE_BOOKMARK_ID, id);
      visible && el.setAttribute(_BookmarkNodeSpec.ATTRIBUTE_BOOKMARK_VISIBLE, 'true');
    }
  }]);
  return BookmarkNodeView;
}(_CustomNodeView3.default);

exports.default = BookmarkNodeView;