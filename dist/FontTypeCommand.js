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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _applyMark = require('./applyMark');

var _applyMark2 = _interopRequireDefault(_applyMark);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _MarkNames = require('./MarkNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setFontType(tr, schema, name) {
  var markType = schema.marks[_MarkNames.MARK_FONT_TYPE];
  if (!markType) {
    return tr;
  }
  var _tr = tr,
      selection = _tr.selection;

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }
  var attrs = name ? { name: name } : null;
  tr = (0, _applyMark2.default)(tr, schema, markType, attrs);
  return tr;
}

var FontTypeCommand = function (_UICommand) {
  (0, _inherits3.default)(FontTypeCommand, _UICommand);

  function FontTypeCommand(name) {
    (0, _classCallCheck3.default)(this, FontTypeCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (FontTypeCommand.__proto__ || (0, _getPrototypeOf2.default)(FontTypeCommand)).call(this));

    _this._label = null;
    _this._name = '';
    _this._popUp = null;

    _this.renderLabel = function (state) {
      return _this._label;
    };

    _this.isEnabled = function (state) {
      var schema = state.schema,
          selection = state.selection;

      if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
        return false;
      }
      var markType = schema.marks[_MarkNames.MARK_FONT_TYPE];
      if (!markType) {
        return false;
      }
      return !selection.empty;
    };

    _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;

      var tr = setFontType(state.tr.setSelection(selection), schema, _this._name);
      if (dispatch && tr.docChanged) {
        dispatch(tr);
        return true;
      }
      return false;
    };

    _this._name = name;
    _this._label = name ? _react2.default.createElement(
      'span',
      { style: { fontFamily: name } },
      name
    ) : null;
    return _this;
  }

  return FontTypeCommand;
}(_UICommand3.default);

exports.default = FontTypeCommand;