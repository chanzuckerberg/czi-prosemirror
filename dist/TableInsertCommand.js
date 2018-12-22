'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _insertTable = require('./insertTable');

var _insertTable2 = _interopRequireDefault(_insertTable);

var _PopUpPosition = require('./ui/PopUpPosition');

var _TableGridSizeEditor = require('./ui/TableGridSizeEditor');

var _TableGridSizeEditor2 = _interopRequireDefault(_TableGridSizeEditor);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_TableGridSizeEditorValue = require('./ui/TableGridSizeEditor').babelPluginFlowReactPropTypes_proptype_TableGridSizeEditorValue || require('prop-types').any;

var TableInsertCommand = function (_UICommand) {
  (0, _inherits3.default)(TableInsertCommand, _UICommand);

  function TableInsertCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TableInsertCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TableInsertCommand.__proto__ || (0, _getPrototypeOf2.default)(TableInsertCommand)).call.apply(_ref, [this].concat(args))), _this), _this._popUp = null, _this.shouldRespondToUIEvent = function (e) {
      return e.type === _UICommand3.default.EventType.MOUSEENTER;
    }, _this.isEnabled = function (state) {
      var tr = state;
      var selection = tr.selection;

      if (selection instanceof _prosemirrorState.TextSelection) {
        return selection.from === selection.to;
      }
      return false;
    }, _this.waitForUserInput = function (state, dispatch, view, event) {
      if (_this._popUp) {
        return _promise2.default.resolve(undefined);
      }
      var target = (0, _nullthrows2.default)(event).currentTarget;
      if (!(target instanceof HTMLElement)) {
        return _promise2.default.resolve(undefined);
      }

      var anchor = event ? event.currentTarget : null;
      return new _promise2.default(function (resolve) {
        _this._popUp = (0, _createPopUp2.default)(_TableGridSizeEditor2.default, null, {
          anchor: anchor,
          position: _PopUpPosition.atAnchorRight,
          onClose: function onClose(val) {
            if (_this._popUp) {
              _this._popUp = null;
              resolve(val);
            }
          }
        });
      });
    }, _this.executeWithUserInput = function (state, dispatch, view, inputs) {
      if (dispatch) {
        var selection = state.selection,
            schema = state.schema;
        var _tr = state.tr;

        if (inputs) {
          var rows = inputs.rows,
              cols = inputs.cols;

          _tr = _tr.setSelection(selection);
          _tr = (0, _insertTable2.default)(_tr, schema, rows, cols);
        }
        dispatch(_tr);
      }
      return false;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return TableInsertCommand;
}(_UICommand3.default);

exports.default = TableInsertCommand;