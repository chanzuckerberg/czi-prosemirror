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

var _toggleHeading = require('./toggleHeading');

var _toggleHeading2 = _interopRequireDefault(_toggleHeading);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeadingCommand = function (_UICommand) {
  (0, _inherits3.default)(HeadingCommand, _UICommand);

  function HeadingCommand(level) {
    (0, _classCallCheck3.default)(this, HeadingCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HeadingCommand.__proto__ || (0, _getPrototypeOf2.default)(HeadingCommand)).call(this));

    _this.isActive = function (state) {
      var result = _this._findHeading(state);
      return !!(result && result.node && result.node.attrs && result.node.attrs.level === _this._level);
    };

    _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;

      var tr = (0, _toggleHeading2.default)(state.tr.setSelection(selection), schema, _this._level);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    };

    _this._level = level;
    return _this;
  }

  (0, _createClass3.default)(HeadingCommand, [{
    key: '_findHeading',
    value: function _findHeading(state) {
      var heading = state.schema.nodes[_NodeNames.HEADING];
      var fn = heading ? (0, _prosemirrorUtils.findParentNodeOfType)(heading) : _noop2.default;
      return fn(state.selection);
    }
  }]);
  return HeadingCommand;
}(_UICommand3.default);

exports.default = HeadingCommand;