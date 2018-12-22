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

exports.default = createCommand;

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCommand(execute) {
  var CustomCommand = function (_UICommand) {
    (0, _inherits3.default)(CustomCommand, _UICommand);

    function CustomCommand() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3.default)(this, CustomCommand);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CustomCommand.__proto__ || (0, _getPrototypeOf2.default)(CustomCommand)).call.apply(_ref, [this].concat(args))), _this), _this.isEnabled = function (state) {
        return _this.execute(state);
      }, _this.execute = function (state, dispatch, view) {
        var tr = state.tr;
        var endTr = tr;
        execute(state, function (nextTr) {
          endTr = nextTr;
          dispatch && dispatch(endTr);
        }, view);
        return endTr.docChanged || tr !== endTr;
      }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    return CustomCommand;
  }(_UICommand3.default);

  return new CustomCommand();
}