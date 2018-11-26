'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _toggleBlockquote = require('./toggleBlockquote');

var _toggleBlockquote2 = _interopRequireDefault(_toggleBlockquote);

var _NodeNames = require('./NodeNames');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findBlockQuote = void 0;

var BlockquoteCommand = function (_UICommand) {
  (0, _inherits3.default)(BlockquoteCommand, _UICommand);

  function BlockquoteCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, BlockquoteCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = BlockquoteCommand.__proto__ || (0, _getPrototypeOf2.default)(BlockquoteCommand)).call.apply(_ref, [this].concat(args))), _this), _this.isActive = function (state) {
      var blockquote = state.schema.nodes[_NodeNames.BLOCKQUOTE];
      return !!(blockquote && (0, _prosemirrorUtils.findParentNodeOfType)(blockquote)(state.selection));
    }, _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;

      var tr = (0, _toggleBlockquote2.default)(state.tr.setSelection(selection), schema);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return BlockquoteCommand;
}(_UICommand3.default);

exports.default = BlockquoteCommand;