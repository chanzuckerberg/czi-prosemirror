'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toHexColor = require('./ui/toHexColor');

var _toHexColor2 = _interopRequireDefault(_toHexColor);

var _prosemirrorTables = require('prosemirror-tables');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableNodesSpecs = (0, _prosemirrorTables.tableNodes)({
  // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    borderColor: {
      default: null,
      getFromDOM: function getFromDOM(dom) {
        var borderColor = dom.style.borderColor;

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