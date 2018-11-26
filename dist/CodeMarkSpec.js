'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var CODE_DOM = ['code', 0];

var CodeMarkSpec = {
  parseDOM: [{ tag: 'code' }],
  toDOM: function toDOM() {
    return CODE_DOM;
  }
};

exports.default = CodeMarkSpec;