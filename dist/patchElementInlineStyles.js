'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchElementInlineStyles;

var _hyphenize = require('./hyphenize');

var _hyphenize2 = _interopRequireDefault(_hyphenize);

var _toHexColor = require('./ui/toHexColor');

var _toHexColor2 = _interopRequireDefault(_toHexColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patchElementInlineStyles(doc) {
  // Clean up inline styles added by brower while copying content.
  var iEls = (0, _from2.default)(doc.querySelectorAll('*[style]'));
  iEls.forEach(clearInlineStyles);

  // Ensure that inline-styles can be correctly translated as inline marks.
  // Workaround to patch inline styles added to <p /> by google doc.
  var bEls = (0, _from2.default)(doc.querySelectorAll('p[style]'));
  bEls.forEach(patchBlockElement);
}

var DEFAULT_TEXT_COLOR = '#000000';
var DEFAULT_BACKGROUND_COLOR = '#ffffff';
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_ELEMENT = 1;
var INLINE_STYLE_NAMES = ['backgroundColor', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'textDecoration'];

var INLINE_ELEMENT_NODE_NAMES = new _set2.default(['A', 'B', 'EM', 'I', 'SPAN', 'STRONG', 'U']);

function patchBlockElement(el) {
  INLINE_STYLE_NAMES.forEach(function (name) {
    return patchBlockElementStyle(el, name);
  });
}

function clearInlineStyles(el) {
  var style = el.style;

  if (!style) {
    return;
  }
  var color = style.color,
      backgroundColor = style.backgroundColor;

  if (color && (0, _toHexColor2.default)(color) === DEFAULT_TEXT_COLOR) {
    style.color = '';
  }
  if (backgroundColor && backgroundColor === DEFAULT_BACKGROUND_COLOR) {
    style.backgroundColor = '';
  }
}

// Move the specified inline style of the element to its child nodes. This
// assumes that its child nodes are inline elements.
function patchBlockElementStyle(el, inlineStyleName) {
  var element = el;
  var elementStyle = element.style;
  var value = elementStyle && elementStyle[inlineStyleName];
  if (!value) {
    return;
  }

  // Remove the style.
  elementStyle[inlineStyleName] = '';

  var childNodes = (0, _from2.default)(element.childNodes);
  childNodes.forEach(function (node) {
    var nodeType = node.nodeType,
        style = node.style,
        nodeName = node.nodeName,
        ownerDocument = node.ownerDocument,
        parentElement = node.parentElement;


    if (nodeType === NODE_TYPE_ELEMENT) {
      if (INLINE_ELEMENT_NODE_NAMES.has(nodeName)) {
        var cssText = (0, _hyphenize2.default)(inlineStyleName) + ': ' + value + ';' + style.cssText;
        style.cssText = cssText;
      }
    } else if (nodeType === NODE_TYPE_TEXT) {
      if (ownerDocument && parentElement) {
        var span = ownerDocument.createElement('span');
        span.style[inlineStyleName] = value;
        parentElement.insertBefore(span, node);
        span.appendChild(node);
      }
    }
  });
}