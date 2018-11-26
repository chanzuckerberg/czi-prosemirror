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

var _updateIndentLevel = require('./updateIndentLevel');

var _updateIndentLevel2 = _interopRequireDefault(_updateIndentLevel);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IndentCommand = function (_UICommand) {
  (0, _inherits3.default)(IndentCommand, _UICommand);

  function IndentCommand(delta) {
    (0, _classCallCheck3.default)(this, IndentCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (IndentCommand.__proto__ || (0, _getPrototypeOf2.default)(IndentCommand)).call(this));

    _this.isActive = function (state) {
      return false;
    };

    _this.execute = function (state, dispatch, view) {
      var selection = state.selection,
          tr = state.tr,
          schema = state.schema;

      tr = tr.setSelection(selection);
      tr = (0, _updateIndentLevel2.default)(tr, schema, _this._delta);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    };

    _this._delta = delta;
    return _this;
  }

  return IndentCommand;
}(_UICommand3.default);

exports.default = IndentCommand;