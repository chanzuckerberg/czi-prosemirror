'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var TextUnderlineMarkSpec = {
  parseDOM: [{ tag: 'u' }, {
    style: 'text-decoration-line',
    getAttrs: function getAttrs(value) {
      return value === 'underline' && null;
    }
  }, {
    style: 'text-decoration',
    getAttrs: function getAttrs(value) {
      return value === 'underline' && null;
    }
  }],
  toDOM: function toDOM() {
    return ['u', 0];
  }
};

exports.default = TextUnderlineMarkSpec;