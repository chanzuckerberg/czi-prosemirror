'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

require('./ui/czi-pop-up.css');

var _LinkTooltip = require('./ui/LinkTooltip');

var _LinkTooltip2 = _interopRequireDefault(_LinkTooltip);

var _LinkURLEditor = require('./ui/LinkURLEditor');

var _LinkURLEditor2 = _interopRequireDefault(_LinkURLEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _applyMark = require('./applyMark');

var _applyMark2 = _interopRequireDefault(_applyMark);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _findNodesWithSameMark = require('./findNodesWithSameMark');

var _findNodesWithSameMark2 = _interopRequireDefault(_findNodesWithSameMark);

var _uuid = require('./ui/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _MarkNames = require('./MarkNames');

var _prosemirrorTransform = require('prosemirror-transform');

var _SelectionPlaceholderPlugin = require('./SelectionPlaceholderPlugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://prosemirror.net/examples/tooltip/
var SPEC = {
  view: function view(editorView) {
    return new LinkTooltipView(editorView);
  }
};

var LinkTooltipPlugin = function (_Plugin) {
  (0, _inherits3.default)(LinkTooltipPlugin, _Plugin);

  function LinkTooltipPlugin() {
    (0, _classCallCheck3.default)(this, LinkTooltipPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (LinkTooltipPlugin.__proto__ || (0, _getPrototypeOf2.default)(LinkTooltipPlugin)).call(this, SPEC));
  }

  return LinkTooltipPlugin;
}(_prosemirrorState.Plugin);

var LinkTooltipView = function () {
  function LinkTooltipView(editorView) {
    var _this2 = this;

    (0, _classCallCheck3.default)(this, LinkTooltipView);
    this._el = null;
    this._popUp = null;

    this._onEdit = function (view) {
      if (_this2._popUp) {
        return;
      }

      var state = view.state;
      var schema = state.schema,
          doc = state.doc,
          selection = state.selection;
      var from = selection.from,
          to = selection.to;

      var markType = schema.marks[_MarkNames.MARK_LINK];
      var result = (0, _findNodesWithSameMark2.default)(doc, from, to, markType);
      if (!result) {
        return;
      }
      var tr = state.tr;

      var linkSelection = _prosemirrorState.TextSelection.create(tr.doc, result.from.pos, result.to.pos + 1);

      tr = tr.setSelection(linkSelection);
      tr = (0, _SelectionPlaceholderPlugin.showSelectionPlaceholder)(state, tr);
      view.dispatch(tr);

      var href = result ? result.mark.attrs.href : null;
      _this2._popUp = (0, _createPopUp2.default)(_LinkURLEditor2.default, { href: href }, {
        onClose: function onClose(value) {
          _this2._popUp = null;
          _this2._onEditEnd(view, selection, value);
        }
      });
    };

    this._onRemove = function (view) {
      _this2._onEditEnd(view, view.state.selection, null);
    };

    this._onEditEnd = function (view, initialSelection, href) {
      var state = view.state,
          dispatch = view.dispatch;

      var tr = (0, _SelectionPlaceholderPlugin.hideSelectionPlaceholder)(state);

      if (href !== undefined) {
        var schema = state.schema;

        var markType = schema.marks[_MarkNames.MARK_LINK];
        if (markType) {
          var result = (0, _findNodesWithSameMark2.default)(tr.doc, initialSelection.from, initialSelection.to, markType);
          if (result) {
            var linkSelection = _prosemirrorState.TextSelection.create(tr.doc, result.from.pos, result.to.pos + 1);
            tr = tr.setSelection(linkSelection);
            var attrs = href ? { href: href } : null;
            tr = (0, _applyMark2.default)(tr, schema, markType, attrs);
          }
        }
      }
      tr = tr.setSelection(initialSelection);
      dispatch(tr);
      view.focus();
    };

    var el = document.createElement('div');
    this._el = el;

    el.className = 'czi-pop-up-element';

    var parentNode = editorView.dom.parentNode;

    parentNode && parentNode.appendChild(el);

    this.update(editorView, null);
  }

  (0, _createClass3.default)(LinkTooltipView, [{
    key: 'update',
    value: function update(view, lastState) {

      var el = this._el;
      if (!el) {
        return;
      }

      var state = view.state;
      var doc = state.doc,
          selection = state.selection,
          schema = state.schema,
          storedMarks = state.storedMarks;

      var markType = schema.marks[_MarkNames.MARK_LINK];
      if (!markType) {
        return;
      }
      var from = selection.from,
          to = selection.to;

      var result = (0, _findNodesWithSameMark2.default)(doc, from, to, markType);

      if (!result) {
        el.parentNode && el.parentNode.removeChild(el);
        _reactDom2.default.unmountComponentAtNode(el);
        return;
      }

      // These are in screen coordinates
      var start = view.coordsAtPos(from);
      var end = view.coordsAtPos(to);

      // The box in which the tooltip is positioned, to use as base
      // const box = el.offsetParent.getBoundingClientRect();
      // Find a center-ish x position from the selection endpoints (when
      // crossing lines, end may be more to the left)
      var left = Math.max((start.left + end.left) / 2, start.left + 3);
      el.style.left = left + 'px';
      el.style.top = start.top + 'px';

      var _document = document,
          body = _document.body;

      if (!el.parentNode && body) {
        body.appendChild(el);
      }

      _reactDom2.default.render(_react2.default.createElement(_LinkTooltip2.default, {
        editorView: view,
        href: result.mark.attrs.href,
        onEdit: this._onEdit,
        onRemove: this._onRemove
      }), el);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var el = this._el;
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
        _reactDom2.default.unmountComponentAtNode(el);
      }
      this._popUp && this._popUp.close();
    }
  }]);
  return LinkTooltipView;
}();

exports.default = LinkTooltipPlugin;