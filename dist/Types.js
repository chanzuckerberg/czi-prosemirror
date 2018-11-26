"use strict";

if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_NodeSpec", {
  value: require("prop-types").shape({
    attrs: require("prop-types").shape({}),
    content: require("prop-types").string,
    draggable: require("prop-types").bool,
    group: require("prop-types").string,
    inline: require("prop-types").bool,
    parseDOM: require("prop-types").arrayOf(require("prop-types").any),
    toDOM: require("prop-types").func
  })
});
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_MarkSpec", {
  value: require("prop-types").shape({
    attrs: require("prop-types").shape({}),
    parseDOM: require("prop-types").arrayOf(require("prop-types").any).isRequired,
    toDOM: require("prop-types").func.isRequired
  })
});
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_EditorProps", {
  value: require("prop-types").shape({})
});
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_DirectEditorProps", {
  value: require("prop-types").shape({})
});