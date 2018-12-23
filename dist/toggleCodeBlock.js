'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleCodeBlock;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _MarkNames = require('./MarkNames');

var _NodeNames = require('./NodeNames');

var _clearMarks = require('./clearMarks');

var _clearMarks2 = _interopRequireDefault(_clearMarks);

var _compareNumber = require('./compareNumber');

var _compareNumber2 = _interopRequireDefault(_compareNumber);

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleCodeBlock(tr, schema) {
  var nodes = schema.nodes;
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;

  var codeBlock = nodes[_NodeNames.CODE_BLOCK];
  var paragraph = nodes[_NodeNames.PARAGRAPH];
  var heading = nodes[_NodeNames.HEADING];
  var blockquote = nodes[_NodeNames.BLOCKQUOTE];
  if (!selection || !doc || !codeBlock || !paragraph) {
    return tr;
  }

  var poses = [];
  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;

  var allowed = true;
  var startWithCodeBlock = null;
  doc.nodesBetween(from, to, function (node, pos) {
    var nodeType = node.type;
    if (startWithCodeBlock === null) {
      startWithCodeBlock = nodeType === codeBlock;
    }
    var type = node.type,
        isBlock = node.isBlock;

    if (isBlock) {
      allowed = allowed && (type === paragraph || type === codeBlock || type === heading || type === blockquote);
      allowed && poses.push(pos);
    }

    return isBlock;
  });

  // Update from the bottom to avoid disruptive changes in pos.
  allowed && poses.sort(_compareNumber2.default).reverse().forEach(function (pos) {
    tr = setCodeBlockNodeEnabled(tr, schema, pos, startWithCodeBlock ? false : true);
  });
  return tr;
}

function setCodeBlockNodeEnabled(tr, schema, pos, enabled) {
  var _tr2 = tr,
      doc = _tr2.doc;

  if (!doc) {
    return tr;
  }

  var node = doc.nodeAt(pos);
  if (!node) {
    return tr;
  }
  if ((0, _isListNode2.default)(node)) {
    return tr;
  }

  var nodes = schema.nodes;

  var codeBlock = nodes[_NodeNames.CODE_BLOCK];
  var paragraph = nodes[_NodeNames.PARAGRAPH];

  if (codeBlock && !enabled && node.type === codeBlock) {
    tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
  } else if (enabled && node.type !== codeBlock) {
    var _tr3 = tr,
        selection = _tr3.selection;

    tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, pos, pos + node.nodeSize));
    tr = (0, _clearMarks2.default)(tr, schema);
    tr = tr.removeMark(pos, pos + node.nodeSize, schema.marks[_MarkNames.MARK_LINK]);
    tr = tr.setSelection(selection);
    tr = tr.setNodeMarkup(pos, codeBlock, node.attrs, node.marks);
  }
  return tr;
}