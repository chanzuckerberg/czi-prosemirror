'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var NO_WRAP_DOM = ['nobr', 0];

var TextNoWrapMarkSpec = {
  parseDOM: [{ tag: 'nobr' }],
  toDOM: function toDOM() {
    return NO_WRAP_DOM;
  }
};

exports.default = TextNoWrapMarkSpec;