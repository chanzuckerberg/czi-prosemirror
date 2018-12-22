'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleCodeBlock;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _NodeNames = require('./NodeNames');

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
  if (!selection || !doc || !codeBlock || !paragraph) {
    return tr;
  }

  var poses = [];
  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;

  var startWithCodeBlock = null;
  doc.nodesBetween(from, to, function (node, pos) {
    var nodeType = node.type;
    if (startWithCodeBlock === null) {
      startWithCodeBlock = nodeType === codeBlock;
    }
    poses.push(pos);
    return !(0, _isListNode2.default)(node);
  });

  // Update from the bottom to avoid disruptive changes in pos.
  poses.sort(_compareNumber2.default).reverse().forEach(function (pos) {
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
  if (!enabled && paragraph && node.type === codeBlock) {
    tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
  } else if (enabled && codeBlock && node.type === paragraph) {
    tr = tr.setNodeMarkup(pos, codeBlock, node.attrs, node.marks);
  }
  return tr;
}