'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _prosemirrorTables = require('prosemirror-tables');

var _toCSSColor = require('./ui/toCSSColor');

var _toCSSColor2 = _interopRequireDefault(_toCSSColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NO_VISIBLE_BORDER_WIDTH = new _set2.default(['0pt', '0px']);

// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
var TableNodesSpecs = (0, _prosemirrorTables.tableNodes)({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    borderColor: {
      default: null,
      getFromDOM: function getFromDOM(dom) {
        var _dom$style = dom.style,
            borderColor = _dom$style.borderColor,
            borderWidth = _dom$style.borderWidth;


        if (NO_VISIBLE_BORDER_WIDTH.has(borderWidth)) {
          return 'transparent';
        }

        return borderColor && (0, _toCSSColor2.default)(borderColor) || null;
      },
      setDOMAttr: function setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + (';border-color: ' + value + ';');
        }
      }
    },
    background: {
      default: null,
      // TODO: Move these to a table helper.
      getFromDOM: function getFromDOM(dom) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr: function setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + (';background-color: ' + value + ';');
        }
      }
    }
  }
});

// Override the default table node spec to support custom attributes.
var TableNodeSpec = (0, _assign2.default)({}, TableNodesSpecs.table, {
  attrs: {
    marginLeft: { default: null }
  },
  parseDOM: [{
    tag: 'table',
    getAttrs: function getAttrs(dom) {
      var marginLeft = dom.style.marginLeft;

      if (marginLeft && /\d+px/.test(marginLeft)) {
        return { marginLeft: parseFloat(marginLeft) };
      }
      return undefined;
    }
  }]
});
(0, _assign2.default)(TableNodesSpecs, { table: TableNodeSpec });

exports.default = TableNodesSpecs;