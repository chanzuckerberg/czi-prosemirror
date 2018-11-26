'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var HR_DOM = ['hr'];

var HorizontalRuleNode = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM: function toDOM() {
    return HR_DOM;
  }
};

exports.default = HorizontalRuleNode;