'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('./ui/czi-editor.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _isEditorStateEmpty = require('./isEditorStateEmpty');

var _isEditorStateEmpty2 = _interopRequireDefault(_isEditorStateEmpty);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentPlaceholderView = function () {
  function ContentPlaceholderView(editorView) {
    (0, _classCallCheck3.default)(this, ContentPlaceholderView);

    _initialiseProps.call(this);

    var el = document.createElement('div');
    el.addEventListener('mousedown', this._onMouseDown, true);
    this._el = el;

    el.className = 'czi-editor-content-placeholder';
    editorView.dom.parentNode.appendChild(el);

    this.update(editorView, null);
  }

  (0, _createClass3.default)(ContentPlaceholderView, [{
    key: 'update',
    value: function update(view, lastState) {
      this._view = view;

      var el = this._el;
      if (!el) {
        return;
      }

      console.log(111, view.focused, view);

      if (!(0, _isEditorStateEmpty2.default)(view.state) || view.focused) {
        el.style.display = 'none';
        return;
      }

      var parentEl = el.parentNode;
      var bodyEl = view.docView.dom.firstChild;
      if (!parentEl || !bodyEl) {
        el.style.display = 'none';
        return;
      }

      var parentElRect = parentEl.getBoundingClientRect();
      var bodyRect = bodyEl.getBoundingClientRect();
      var bodyStyle = window.getComputedStyle(bodyEl);

      var left = bodyRect.left - parentElRect.left;
      var top = bodyRect.top - parentElRect.top;

      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.padding = bodyStyle.padding;
      el.style.display = 'block';

      var placeholder = view.placeholder || 'Type Something';

      _reactDom2.default.render(_react2.default.createElement(
        'div',
        null,
        placeholder
      ), el);

      console.log(el);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._view = null;
      var el = this._el;
      if (el && el.parentNode) {
        el.removeEventListener('mousedown', this._onMouseDown, true);
        el.parentNode.removeChild(el);
        _reactDom2.default.unmountComponentAtNode(el);
      }
    }
  }]);
  return ContentPlaceholderView;
}();

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._el = null;
  this._view = null;

  this._onMouseDown = function (e) {
    e.preventDefault();
    var el = _this2._el;
    if (el) {
      el.style.display = 'none';
    }
    setTimeout(_this2._focus, 350);
  };

  this._focus = function () {
    var view = _this2._view;
    if (!view || view.focused) {
      return;
    }

    view.focus();
    // view.docView.nodeDOM.focus();
    // view.focus();
  };
};

var ContentPlaceholderPlugin = function (_Plugin) {
  (0, _inherits3.default)(ContentPlaceholderPlugin, _Plugin);

  function ContentPlaceholderPlugin() {
    (0, _classCallCheck3.default)(this, ContentPlaceholderPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (ContentPlaceholderPlugin.__proto__ || (0, _getPrototypeOf2.default)(ContentPlaceholderPlugin)).call(this, {
      view: function view(editorView) {
        return new ContentPlaceholderView(editorView);
      }
    }));
  }

  return ContentPlaceholderPlugin;
}(_prosemirrorState.Plugin);

exports.default = ContentPlaceholderPlugin;