'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var EM_DOM = ['em', 0];

var EMMarkSpec = {
  parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
  toDOM: function toDOM() {
    return EM_DOM;
  }
};

exports.default = EMMarkSpec;