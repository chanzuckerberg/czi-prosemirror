'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var TextSuperMarkSpec = {
  parseDOM: [{ tag: 'sup' }, {
    style: 'vertical-align',
    getAttrs: function getAttrs(value) {
      return value === 'super' && null;
    }
  }],
  toDOM: function toDOM() {
    return ['sup', 0];
  }
};

exports.default = TextSuperMarkSpec;