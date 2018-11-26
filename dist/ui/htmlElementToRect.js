"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = htmlElementToRect;
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_Rect", {
  value: require("prop-types").shape({
    h: require("prop-types").number.isRequired,
    w: require("prop-types").number.isRequired,
    x: require("prop-types").number.isRequired,
    y: require("prop-types").number.isRequired
  })
});
function htmlElementToRect(el) {
  var rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height
  };
}