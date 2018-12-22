'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insertTable;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _NodeNames = require('./NodeNames');

function insertTable(tr, schema, rows, cols) {
  if (!tr.selection || !tr.doc) {
    return tr;
  }
  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;

  if (from !== to) {
    return tr;
  }

  var nodes = schema.nodes;

  var cell = nodes[_NodeNames.TABLE_CELL];
  var paragraph = nodes[_NodeNames.PARAGRAPH];
  var row = nodes[_NodeNames.TABLE_ROW];
  var table = nodes[_NodeNames.TABLE];
  if (!(cell && paragraph && row && table)) {
    return tr;
  }

  var rowNodes = [];
  for (var rr = 0; rr < rows; rr++) {
    var cellNodes = [];
    for (var cc = 0; cc < cols; cc++) {
      var textNode = schema.text(' ');
      var paragraphNode = paragraph.create({}, _prosemirrorModel.Fragment.from(textNode));
      var cellNode = cell.create({}, _prosemirrorModel.Fragment.from(paragraphNode));
      cellNodes.push(cellNode);
    }
    var rowNode = row.create({}, _prosemirrorModel.Fragment.from(cellNodes));
    rowNodes.push(rowNode);
  }
  var tableNode = table.create({}, _prosemirrorModel.Fragment.from(rowNodes));
  tr = tr.insert(from, _prosemirrorModel.Fragment.from(tableNode));

  var selection = _prosemirrorState.TextSelection.create(tr.doc, from + 5, from + 5);

  tr = tr.setSelection(selection);
  return tr;
}