'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _prosemirrorTables = require('prosemirror-tables');

var _toHexColor = require('./ui/toHexColor');

var _toHexColor2 = _interopRequireDefault(_toHexColor);

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

        return borderColor && (0, _toHexColor2.default)(borderColor) || null;
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

exports.default = TableNodesSpecs;