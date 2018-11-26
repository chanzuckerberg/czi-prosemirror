'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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

var _toggleCodeBlock = require('./toggleCodeBlock');

var _toggleCodeBlock2 = _interopRequireDefault(_toggleCodeBlock);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

var _prosemirrorCommands = require('prosemirror-commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CodeBlockCommand = function (_UICommand) {
  (0, _inherits3.default)(CodeBlockCommand, _UICommand);

  function CodeBlockCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CodeBlockCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CodeBlockCommand.__proto__ || (0, _getPrototypeOf2.default)(CodeBlockCommand)).call.apply(_ref, [this].concat(args))), _this), _this.isActive = function (state) {
      var result = _this._findCodeBlock(state);
      return !!(result && result.node);
    }, _this.execute = function (state, dispatch, view) {
      var selection = state.selection,
          schema = state.schema;
      var tr = state.tr;

      tr = tr.setSelection(selection);
      tr = (0, _toggleCodeBlock2.default)(tr, schema);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(CodeBlockCommand, [{
    key: '_findCodeBlock',
    value: function _findCodeBlock(state) {
      var codeBlock = state.schema.nodes[_NodeNames.CODE_BLOCK];
      var findCodeBlock = codeBlock ? (0, _prosemirrorUtils.findParentNodeOfType)(codeBlock) : _noop2.default;
      return findCodeBlock(state.selection);
    }
  }]);
  return CodeBlockCommand;
}(_UICommand3.default);

exports.default = CodeBlockCommand;