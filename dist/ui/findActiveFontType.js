'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FONT_TYPE_NAME_DEFAULT = undefined;
exports.default = findActiveFontType;

var _prosemirrorState = require('prosemirror-state');

var _MarkNames = require('../MarkNames');

var _findActiveMark = require('../findActiveMark');

var _findActiveMark2 = _interopRequireDefault(_findActiveMark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This should map to `--czi-content-font-size` at `czi-editor.css`.
var FONT_TYPE_NAME_DEFAULT = exports.FONT_TYPE_NAME_DEFAULT = 'Arial';

function findActiveFontType(state) {
  var schema = state.schema,
      doc = state.doc,
      selection = state.selection,
      tr = state.tr;

  var markType = schema.marks[_MarkNames.MARK_FONT_TYPE];
  if (!markType) {
    return FONT_TYPE_NAME_DEFAULT;
  }
  var from = selection.from,
      to = selection.to,
      empty = selection.empty;


  if (empty) {
    var storedMarks = tr.storedMarks || state.storedMarks || selection.$cursor.marks() || [];
    var sm = storedMarks.find(function (m) {
      return m.type === markType;
    });
    return sm && sm.attrs.name || FONT_TYPE_NAME_DEFAULT;
  }

  var mark = markType ? (0, _findActiveMark2.default)(doc, from, to, markType) : null;
  var fontName = mark && mark.attrs.name;
  if (!fontName) {
    return FONT_TYPE_NAME_DEFAULT;
  }

  var domDoc = typeof document === 'undefined' ? null : document;

  if (domDoc && domDoc.fonts && domDoc.fonts.check) {
    return domDoc.fonts.check('12px "' + fontName + '"') ? fontName : FONT_TYPE_NAME_DEFAULT;
  }

  return fontName;
}