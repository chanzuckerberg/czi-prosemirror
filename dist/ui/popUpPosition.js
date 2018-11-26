'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.atAnchorBottom = atAnchorBottom;
exports.atAnchorBottomCenter = atAnchorBottomCenter;
exports.atAnchorRight = atAnchorRight;
exports.atViewportCenter = atViewportCenter;

var _rects = require('./rects');

var babelPluginFlowReactPropTypes_proptype_Rect = require('./rects').babelPluginFlowReactPropTypes_proptype_Rect || require('prop-types').any;

function atAnchorBottom(anchorRect, bodyRect) {
  var rect = { x: 0, y: 0, w: 0, h: 0 };
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x;
    rect.y = anchorRect.y + anchorRect.h;
  }

  if (!anchorRect || (0, _rects.isCollapsed)(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

function atAnchorBottomCenter(anchorRect, bodyRect) {
  var rect = { x: 0, y: 0, w: 0, h: 0 };
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x - (bodyRect.w - anchorRect.w) / 2;
    rect.y = anchorRect.y + anchorRect.h;
  }

  if (!anchorRect || (0, _rects.isCollapsed)(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

function atAnchorRight(anchorRect, bodyRect) {
  var rect = { x: 0, y: 0, w: 0, h: 0 };
  if (anchorRect && bodyRect) {
    rect.x = anchorRect.x + anchorRect.w + 1;
    rect.y = anchorRect.y;
  }

  if (!anchorRect || (0, _rects.isCollapsed)(anchorRect)) {
    rect.x = -10000;
  }

  return rect;
}

function atViewportCenter(anchorRect, bodyRect) {
  var rect = { x: 0, y: 0, w: 0, h: 0 };
  if (bodyRect) {
    rect.x = (window.innerWidth - bodyRect.w) / 2;
    rect.y = (window.innerHeight - bodyRect.h) / 2;
  }

  if (!bodyRect || (0, _rects.isCollapsed)(bodyRect)) {
    rect.x = -10000;
  }

  return rect;
}