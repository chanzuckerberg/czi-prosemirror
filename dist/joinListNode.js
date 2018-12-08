'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinListNode;

var _joinDown = require('./joinDown');

var _joinDown2 = _interopRequireDefault(_joinDown);

var _joinUp = require('./joinUp');

var _joinUp2 = _interopRequireDefault(_joinUp);

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function joinListNode(tr, schema, listNodePos) {
  if (!tr.doc || !tr.selection) {
    return tr;
  }
  var node = tr.doc.nodeAt(listNodePos);
  if (!(0, _isListNode2.default)(node)) {
    return tr;
  }
  var initialSelection = tr.selection;
  var listFromPos = listNodePos;
  var listToPos = listFromPos + node.nodeSize;
  var $fromPos = tr.doc.resolve(listFromPos);
  var $toPos = tr.doc.resolve(listToPos);

  var selectionOffset = 0;
  if ($toPos.nodeAfter && $toPos.nodeAfter.type === node.type && $toPos.nodeAfter.attrs.level === node.attrs.level) {
    tr = (0, _joinDown2.default)(tr);
  }

  if ($fromPos.nodeBefore && $fromPos.nodeBefore.type === node.type && $fromPos.nodeBefore.attrs.level === node.attrs.level) {
    selectionOffset -= 2;
    tr = (0, _joinUp2.default)(tr);
  }

  var selection = _prosemirrorState.TextSelection.create(tr.doc, initialSelection.from + selectionOffset, initialSelection.to + selectionOffset);

  tr = tr.setSelection(selection);
  return tr;
}