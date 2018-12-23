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

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _clearMarks = require('./clearMarks');

var _clearMarks2 = _interopRequireDefault(_clearMarks);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MarksClearCommand = function (_UICommand) {
  (0, _inherits3.default)(MarksClearCommand, _UICommand);

  function MarksClearCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MarksClearCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MarksClearCommand.__proto__ || (0, _getPrototypeOf2.default)(MarksClearCommand)).call.apply(_ref, [this].concat(args))), _this), _this.isActive = function (state) {
      return false;
    }, _this.isEnabled = function (state) {
      var selection = state.selection;

      return !selection.empty && (selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection);
    }, _this.execute = function (state, dispatch, view) {
      var tr = (0, _clearMarks2.default)(state.tr.setSelection(state.selection), state.schema);
      if (dispatch && tr.docChanged) {
        dispatch(tr);
        return true;
      }
      return false;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return MarksClearCommand;
}(_UICommand3.default);

exports.default = MarksClearCommand;