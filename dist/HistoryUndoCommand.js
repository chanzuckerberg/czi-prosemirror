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

var _Icon = require('./ui/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorHistory = require('prosemirror-history');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HistoryUndoCommand = function (_UICommand) {
  (0, _inherits3.default)(HistoryUndoCommand, _UICommand);

  function HistoryUndoCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, HistoryUndoCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = HistoryUndoCommand.__proto__ || (0, _getPrototypeOf2.default)(HistoryUndoCommand)).call.apply(_ref, [this].concat(args))), _this), _this.execute = function (state, dispatch, view) {
      return (0, _prosemirrorHistory.undo)(state, dispatch);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return HistoryUndoCommand;
}(_UICommand3.default);

exports.default = HistoryUndoCommand;