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

var _applyMark = require('./applyMark');

var _applyMark2 = _interopRequireDefault(_applyMark);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _MarkNames = require('./MarkNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setFontSize(tr, schema, pt) {
  var markType = schema.marks[_MarkNames.MARK_FONT_SIZE];
  if (!markType) {
    return tr;
  }
  var _tr = tr,
      selection = _tr.selection;

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }
  var attrs = pt ? { pt: pt } : null;
  tr = (0, _applyMark2.default)(tr, schema, markType, attrs);
  return tr;
}

var FontSizeCommand = function (_UICommand) {
  (0, _inherits3.default)(FontSizeCommand, _UICommand);

  function FontSizeCommand(pt) {
    (0, _classCallCheck3.default)(this, FontSizeCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (FontSizeCommand.__proto__ || (0, _getPrototypeOf2.default)(FontSizeCommand)).call(this));

    _this._popUp = null;
    _this._pt = 0;

    _this.isEnabled = function (state) {
      var schema = state.schema,
          selection = state.selection;

      if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
        return false;
      }
      var markType = schema.marks[_MarkNames.MARK_FONT_SIZE];
      if (!markType) {
        return false;
      }
      return !selection.empty;
    };

    _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;

      var tr = setFontSize(state.tr.setSelection(selection), schema, _this._pt);
      if (dispatch && tr.docChanged) {
        dispatch(tr);
        return true;
      }
      return false;
    };

    _this._pt = pt;
    return _this;
  }

  return FontSizeCommand;
}(_UICommand3.default);

exports.default = FontSizeCommand;