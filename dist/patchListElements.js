'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchListElements;

var _ListItemNodeSpec = require('./ListItemNodeSpec');

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var _patchStyleElements = require('./patchStyleElements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patchListElements(doc) {
  (0, _from2.default)(doc.querySelectorAll('ol, ul')).forEach(patchListElementsElement);
}

// This assumes that every 36pt maps to one indent level.


var CHAR_BULLET = '\u25CF';
var CHAR_CIRCLE = '\u25CB';
var CHAR_SQUARE = '\u25A0';
var CHAR_BOX = '\u274F';
var CHAR_ZERO_SPACE = '\u200B';
var INLINE_NODE_NAME_PATTERN = /^(#text)|(A|SPAN|B|STRONG)$/;

function patchListElementsElement(listElement) {
  // If the children of `listElement` all have teh same marginLeft, assume
  // it to be indented.
  var marginLeft = undefined;
  var beforeContent = undefined;
  var parentElement = listElement.parentElement,
      children = listElement.children;

  // A workaround to patch the issue when <ul /> or <ol /> is pasted as the
  // first child of <body />, its first <li /> somehow can't be wrapped
  // with the list. The hack is to prepend zero-width-space character
  // before the list.

  if (parentElement && parentElement.nodeName === 'BODY' && parentElement.firstChild === listElement) {
    var tt = parentElement.ownerDocument.createTextNode(CHAR_ZERO_SPACE);
    parentElement.insertBefore(tt, listElement);
  }

  if (parentElement && parentElement.nodeName === 'LI') {
    // TODO: Handle this later.
    console.error('nested list is not supported', listElement);
  }
  (0, _from2.default)(children).forEach(function (listItemElement) {
    var style = listItemElement.style;

    patchPaddingStyle(listItemElement);

    var bc = listItemElement.getAttribute(_patchStyleElements.ATTRIBUTE_CSS_BEFORE_CONTENT) || '';
    if (beforeContent === undefined) {
      beforeContent = bc;
    }
    if (beforeContent !== bc) {
      beforeContent = null;
    }

    var ml = style && style.marginLeft || '';
    if (marginLeft === undefined) {
      marginLeft = ml;
    }

    if (ml !== marginLeft) {
      marginLeft = null;
    }
  });

  if (marginLeft) {
    var indent = (0, _ParagraphNodeSpec.convertMarginLeftToIndentValue)(marginLeft);
    if (indent) {
      listElement.setAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT, String(indent));
    }
  }

  if (beforeContent) {
    beforeContent = String(beforeContent);
    var listStyleType = void 0;
    switch (true) {
      case beforeContent.indexOf(CHAR_BULLET) > -1:
        listStyleType = 'disc';
        break;

      case beforeContent.indexOf(CHAR_CIRCLE) > -1:
        listStyleType = 'circle';
        break;

      case beforeContent.indexOf(CHAR_SQUARE) > -1:
        listStyleType = 'square';
        break;

      case beforeContent.indexOf(CHAR_BOX) > -1:
        listStyleType = 'box';
        break;

      case beforeContent.indexOf('lower-latin') > -1:
        listStyleType = 'lower-latin';
        break;

      case beforeContent.indexOf('upper-latin') > -1:
        listStyleType = 'upper-latin';
        break;

      case beforeContent.indexOf('lower-roman') > -1:
        listStyleType = 'lower-roman';
        break;

      case beforeContent.indexOf('upper-roman') > -1:
        listStyleType = 'upper-roman';
        break;

      case beforeContent.indexOf('-') > -1:
        listStyleType = 'dash';
        break;

      default:
        console.log('unknown list style type', beforeContent);
        break;
    }
    if (listStyleType) {
      listElement.setAttribute(_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE, listStyleType);
    }
  }
}

// This moves the styles of <li /> into its content <p />.
function patchPaddingStyle(listItemElement) {
  var style = listItemElement.style,
      childNodes = listItemElement.childNodes;
  var paddingTop = style.paddingTop,
      paddingBottom = style.paddingBottom,
      lineHeight = style.lineHeight;

  if (!_ParagraphNodeSpec.EMPTY_CSS_VALUE.has(paddingBottom) && !_ParagraphNodeSpec.EMPTY_CSS_VALUE.has(paddingTop) && !_ParagraphNodeSpec.EMPTY_CSS_VALUE.has(lineHeight)) {
    return;
  }

  var doc = listItemElement.ownerDocument;
  var frag = doc.createDocumentFragment();
  var contentIsInline = true;

  (0, _from2.default)(childNodes).forEach(function (cn) {
    contentIsInline = contentIsInline && INLINE_NODE_NAME_PATTERN.test(cn.nodeName);
    frag.appendChild(cn);
  });

  if (contentIsInline) {
    // Wrap all inline content with <p /> with the padding style applied.
    var pEl = doc.createElement('p');
    (0, _assign2.default)(pEl.style, {
      lineHeight: lineHeight,
      paddingBottom: paddingBottom,
      paddingTop: paddingTop
    });
    pEl.appendChild(frag);
    listItemElement.appendChild(pEl);
  } else {
    // Unable to patch the style.
    listItemElement.appendChild(frag);
  }
}