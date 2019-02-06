'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findActionableCell;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTables = require('prosemirror-tables');

var _prosemirrorUtils = require('prosemirror-utils');

var _NodeNames = require('./NodeNames');

function findActionableCellFromSelection(selection) {
  var $anchorCell = selection.$anchorCell;

  var start = $anchorCell.start(-1);
  var table = $anchorCell.node(-1);
  var tableMap = _prosemirrorTables.TableMap.get(table);
  var topRightRect = void 0;
  var posFound = null;
  var nodeFound = null;
  selection.forEachCell(function (cell, cellPos) {
    var cellRect = tableMap.findCell(cellPos - start);
    if (!topRightRect || cellRect.top >= topRightRect.top && cellRect.left > topRightRect.left) {
      topRightRect = cellRect;
      posFound = cellPos;
      nodeFound = cell;
    }
  });

  return posFound === null ? null : {
    node: nodeFound,
    pos: posFound
  };
}

function findActionableCell(state) {
  var doc = state.doc,
      selection = state.selection,
      schema = state.schema;

  var tdType = schema.nodes[_NodeNames.TABLE_CELL];
  var thType = schema.nodes[_NodeNames.TABLE_HEADER];
  if (!tdType && !thType) {
    return null;
  }

  var userSelection = selection;

  if (userSelection instanceof _prosemirrorState.TextSelection) {
    var from = selection.from,
        to = selection.to;

    if (from !== to) {
      return null;
    }
    var result = tdType && (0, _prosemirrorUtils.findParentNodeOfType)(tdType)(selection) || thType && (0, _prosemirrorUtils.findParentNodeOfType)(thType)(selection);

    if (!result) {
      return null;
    }

    userSelection = _prosemirrorTables.CellSelection.create(doc, result.pos);
  }

  if (userSelection instanceof _prosemirrorTables.CellSelection) {
    return findActionableCellFromSelection(userSelection);
  }

  return null;
}