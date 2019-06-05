'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _uuid = require('./ui/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Utility Class that allows developer to insert HTML snippets then updates
// document's innerHTML accordingly.
var HTMLMutator = function () {
  function HTMLMutator(doc) {
    (0, _classCallCheck3.default)(this, HTMLMutator);

    this._doc = doc;
    this._htmls = new _map2.default();
  }

  (0, _createClass3.default)(HTMLMutator, [{
    key: 'insertHTMLBefore',
    value: function insertHTMLBefore(html, el) {
      return this._insertHTML(html, 'before', el);
    }
  }, {
    key: 'insertHTMLAfter',
    value: function insertHTMLAfter(html, el) {
      return this._insertHTML(html, 'after', el);
    }
  }, {
    key: 'execute',
    value: function execute() {
      var doc = this._doc;
      var root = (0, _nullthrows2.default)(doc.body || doc.documentElement);
      var newHtml = root.innerHTML;
      this._htmls.forEach(function (html, token) {
        newHtml = newHtml.replace(token, html);
      });
      root.innerHTML = newHtml;
    }
  }, {
    key: '_insertHTML',
    value: function _insertHTML(html, position, el) {
      if (el.ownerDocument !== this._doc) {
        throw new Error('element does not belong to the document');
      }
      // This does not insert the HTML into the document directly.
      // Instead, this inserts a comment token that can be replaced by the HTML
      // later.
      var token = '\u200B_HTMLMutator_token_' + (0, _uuid2.default)() + '_\u200B';
      var node = this._doc.createComment(token);
      var parentElement = (0, _nullthrows2.default)(el.parentElement);
      if (position === 'before') {
        parentElement.insertBefore(node, el);
      } else if (position === 'after') {
        parentElement.insertBefore(node, el.nextSibling);
      } else {
        throw new Error('Invalid position ' + position);
      }
      this._htmls.set('<!--' + token + '-->', html);
      return this;
    }
  }]);
  return HTMLMutator;
}();

exports.default = HTMLMutator;