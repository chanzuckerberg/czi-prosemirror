'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function patchListElementsElement(listElement) {
  // If the children of `listElement` all have teh same marginLeft, assume
  // it to be indented.
  var marginLeft = undefined;
  var beforeContent = undefined;
  var parentElement = listElement.parentElement,
      children = listElement.children;

  if (parentElement && parentElement.nodeName === 'LI') {
    // TODO: Handle this later.
    console.error('nested list is not supported', listElement);
  }
  (0, _from2.default)(children).some(function (child) {
    var style = child.style;

    var bc = child.getAttribute(_patchStyleElements.ATTRIBUTE_CSS_BEFORE_CONTENT) || '';
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

      default:
        console.log('unknown list style type', beforeContent);
        break;
    }
    if (listStyleType) {
      listElement.setAttribute(_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE, listStyleType);
    }
  }
}