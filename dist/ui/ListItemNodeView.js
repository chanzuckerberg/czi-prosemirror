'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorView = require('prosemirror-view');

var _MarkNames = require('../MarkNames');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This implements the `NodeView` interface
// https://prosemirror.net/docs/ref/#view.NodeView
var ListItemNodeView = function () {

  // This implements the `NodeView` interface.
  // The DOM node that should hold the node's content.
  function ListItemNodeView(node, editorView, getPos, decorations) {
    (0, _classCallCheck3.default)(this, ListItemNodeView);

    var dom = document.createElement('li');
    this.dom = dom;
    this.contentDOM = dom;
    this._updateDOM(node);
  }

  // This implements the `NodeView` interface.

  // This implements the `NodeView` interface
  // The outer DOM node that represents the list item element.


  (0, _createClass3.default)(ListItemNodeView, [{
    key: 'update',
    value: function update(node, decorations) {
      return this._updateDOM(node);
    }
  }, {
    key: '_updateDOM',
    value: function _updateDOM(node) {
      if (this._nodeUpdated === node) {
        return false;
      }

      this._nodeUpdated = node;

      var dom = this.dom;
      // According to `ListItemNodeSpec`, a valid list item has the following
      // structure: `li > paragraph > text`.
      var paragraph = node.firstChild;
      var initialContent = paragraph ? paragraph.firstChild : null;

      // This resolves the styles for the counter by examines the marks for the
      // first text node of the list item.
      var marks = initialContent && initialContent.isText && initialContent.textContent ? initialContent.marks : null;

      var cssColor = void 0;
      var cssFontSize = void 0;
      var cssText = '';
      if (Array.isArray(marks)) {
        marks.forEach(function (mark) {
          var attrs = mark.attrs,
              type = mark.type;

          switch (type.name) {
            case _MarkNames.MARK_TEXT_COLOR:
              cssColor = attrs.color;
              break;
            case _MarkNames.MARK_FONT_SIZE:
              cssFontSize = attrs.pt;
              break;
          }
        });
      }

      // The counter of the list item is a pseudo-element that uses
      // the CSS variables (e.g `--czi-list-style-color`) for styling.
      // This defines the CSS variables scoped for the pseudo-element.
      // See `src/ui/czi-list.css` for more details.
      if (cssColor) {
        cssText += '--czi-list-style-color: ' + cssColor + ';';
      }

      if (cssFontSize) {
        cssText += '--czi-list-style-font-size: ' + cssFontSize + 'pt;';
      }

      dom.style.cssText = cssText;

      var align = node.attrs.align;

      if (align) {
        dom.setAttribute('data-align', align);
      } else {
        dom.removeAttribute('data-align');
      }
      return true;
    }
  }]);
  return ListItemNodeView;
}();

exports.default = ListItemNodeView;