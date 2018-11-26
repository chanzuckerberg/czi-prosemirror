'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var BR_DOM = ['br'];

var HardBreakNodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM: function toDOM() {
    return BR_DOM;
  }
};

exports.default = HardBreakNodeSpec;