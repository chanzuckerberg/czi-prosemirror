'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = blockQuoteInputRule;

var _prosemirrorInputrules = require('prosemirror-inputrules');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _NodeNames = require('./NodeNames');

var _toggleBlockquote = require('./toggleBlockquote');

var _toggleBlockquote2 = _interopRequireDefault(_toggleBlockquote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
var MACRO_PATTERN = /^\s*>\s$/;

function handleBlockQuoteInputRule(state, match, start, end) {
  var schema = state.schema;
  var tr = state.tr;

  var nodeType = schema.nodes[_NodeNames.BLOCKQUOTE];
  if (!nodeType) {
    return tr;
  }
  tr = state.tr.delete(start, end);
  tr = (0, _toggleBlockquote2.default)(tr, schema);
  return tr;
}

function blockQuoteInputRule() {
  return new _prosemirrorInputrules.InputRule(MACRO_PATTERN, handleBlockQuoteInputRule);
}