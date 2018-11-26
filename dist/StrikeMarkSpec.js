'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var StrikeMarkSpec = {
  parseDOM: [{
    style: 'text-decoration',
    getAttrs: function getAttrs(value) {
      return value === 'line-through' && null;
    }
  }],
  toDOM: function toDOM() {
    var style = 'text-decoration: line-through';
    return ['span', { style: style }, 0];
  }
};

exports.default = StrikeMarkSpec;