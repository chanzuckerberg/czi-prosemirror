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

var _prosemirrorCommands = require('prosemirror-commands');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _findNodesWithSameMark = require('./findNodesWithSameMark');

var _findNodesWithSameMark2 = _interopRequireDefault(_findNodesWithSameMark);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MarkToggleCommand = function (_UICommand) {
  (0, _inherits3.default)(MarkToggleCommand, _UICommand);

  function MarkToggleCommand(markName) {
    (0, _classCallCheck3.default)(this, MarkToggleCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MarkToggleCommand.__proto__ || (0, _getPrototypeOf2.default)(MarkToggleCommand)).call(this));

    _this.isActive = function (state) {
      var schema = state.schema,
          doc = state.doc,
          selection = state.selection;
      var from = selection.from,
          to = selection.to;

      var markType = schema.marks[_this._markName];
      if (markType && from < to) {
        return !!(0, _findNodesWithSameMark2.default)(doc, from, to - 1, markType);
      }
      return false;
    };

    _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection,
          tr = state.tr;

      var markType = schema.marks[_this._markName];
      if (!markType) {
        return false;
      }

      if (selection.empty && !(selection instanceof _prosemirrorState.TextSelection)) {
        return false;
      }

      var from = selection.from,
          to = selection.to;

      if (tr && to === from + 1) {
        var node = tr.doc.nodeAt(from);
        if (node.isAtom && !node.isText && node.isLeaf) {
          // An atomic node (e.g. Image) is selected.
          return false;
        }
      }

      // TODO: Replace `toggleMark` with transform that does not change scroll
      // position.
      return (0, _prosemirrorCommands.toggleMark)(markType)(state, dispatch, view);
    };

    _this._markName = markName;
    return _this;
  }

  return MarkToggleCommand;
}(_UICommand3.default);

exports.default = MarkToggleCommand;