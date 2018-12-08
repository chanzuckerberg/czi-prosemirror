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

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _MarkNames = require('./MarkNames');

var MarkNames = _interopRequireWildcard(_MarkNames);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _TextAlignCommand = require('./TextAlignCommand');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MARK_EM = MarkNames.MARK_EM,
    MARK_FONT_SIZE = MarkNames.MARK_FONT_SIZE,
    MARK_FONT_TYPE = MarkNames.MARK_FONT_TYPE,
    MARK_STRIKE = MarkNames.MARK_STRIKE,
    MARK_STRONG = MarkNames.MARK_STRONG,
    MARK_TEXT_COLOR = MarkNames.MARK_TEXT_COLOR,
    MARK_TEXT_HIGHLIGHT = MarkNames.MARK_TEXT_HIGHLIGHT,
    MARK_UNDERLINE = MarkNames.MARK_UNDERLINE;


var FORMAT_MARK_NAMES = [MARK_EM, MARK_FONT_SIZE, MARK_FONT_TYPE, MARK_STRIKE, MARK_STRONG, MARK_TEXT_COLOR, MARK_TEXT_HIGHLIGHT, MARK_UNDERLINE];

function clearMarks(tr, schema) {
  var _tr = tr,
      doc = _tr.doc,
      selection = _tr.selection;

  if (!selection || !doc) {
    return tr;
  }
  var from = selection.from,
      to = selection.to,
      empty = selection.empty;

  if (empty) {
    return tr;
  }

  var markTypesToRemove = new _set2.default(FORMAT_MARK_NAMES.map(function (n) {
    return schema.marks[n];
  }).filter(Boolean));

  if (!markTypesToRemove.size) {
    return tr;
  }

  var tasks = [];
  doc.nodesBetween(from, to, function (node, pos) {
    if (node.marks && node.marks.length) {
      node.marks.some(function (mark) {
        if (markTypesToRemove.has(mark.type)) {
          tasks.push({ node: node, pos: pos, mark: mark });
        }
      });
      return true;
    }
    return true;
  });
  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(function (job) {
    var node = job.node,
        mark = job.mark,
        pos = job.pos;

    tr = tr.removeMark(pos, pos + node.nodeSize, mark.type);
  });

  // It should also clear text alignment.
  tr = (0, _TextAlignCommand.setTextAlign)(tr, schema, null);
  return tr;
}

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
      var tr = clearMarks(state.tr.setSelection(state.selection), state.schema);
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