'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = applyMark;

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorCommands = require('prosemirror-commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function markApplies(doc, ranges, type) {
  var _loop = function _loop(i) {
    var _ranges$i = ranges[i],
        $from = _ranges$i.$from,
        $to = _ranges$i.$to;

    var can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, function (node) {
      if (can) return false;
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) return {
        v: true
      };
  };

  for (var i = 0; i < ranges.length; i++) {
    var _ret = _loop(i);

    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
  }
  return false;
}

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js


function applyMark(tr, schema, markType, attrs) {
  if (!tr.selection || !tr.doc || !markType) {
    return tr;
  }
  var _tr$selection = tr.selection,
      empty = _tr$selection.empty,
      $cursor = _tr$selection.$cursor,
      ranges = _tr$selection.ranges;

  if (empty && !$cursor || !markApplies(tr.doc, ranges, markType)) {
    return tr;
  }

  if ($cursor) {
    tr = tr.removeStoredMark(markType);
    return attrs ? tr.addStoredMark(markType.create(attrs)) : tr;
  }

  var has = false;
  for (var i = 0; !has && i < ranges.length; i++) {
    var _ranges$i2 = ranges[i],
        $from = _ranges$i2.$from,
        $to = _ranges$i2.$to;

    has = tr.doc.rangeHasMark($from.pos, $to.pos, markType);
  }
  for (var _i = 0; _i < ranges.length; _i++) {
    var _ranges$_i = ranges[_i],
        _$from = _ranges$_i.$from,
        _$to = _ranges$_i.$to;

    if (has) {
      tr = tr.removeMark(_$from.pos, _$to.pos, markType);
    }
    if (attrs) {
      tr = tr.addMark(_$from.pos, _$to.pos, markType.create(attrs));
    }
  }

  return tr;
}