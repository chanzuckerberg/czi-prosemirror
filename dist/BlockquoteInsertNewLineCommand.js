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

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This handles the case when user press ENTER key to insert a new line
// into blockquote.
function insertNewLine(tr, schema) {
  var _tr = tr,
      selection = _tr.selection;

  if (!selection) {
    return tr;
  }
  var from = selection.from,
      empty = selection.empty;

  if (!empty) {
    return tr;
  }
  var br = schema.nodes[_NodeNames.HARD_BREAK];
  if (!br) {
    return tr;
  }
  var blockquote = schema.nodes[_NodeNames.BLOCKQUOTE];
  var result = (0, _prosemirrorUtils.findParentNodeOfType)(blockquote)(selection);
  if (!result) {
    return tr;
  }

  var pos = result.pos,
      node = result.node;

  var endPos = pos + node.nodeSize - 1;
  if (from === endPos && node.lastChild && node.lastChild.type === br) {
    // It already has a hard break and the selection is at the end of the
    // blockquote. It should let user to create a new block after blockquote.
    return tr;
  }

  tr = tr.insert(from, _prosemirrorModel.Fragment.from(br.create()));
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, from + 1, from + 1));
  return tr;
}

var BlockquoteInsertNewLineCommand = function (_UICommand) {
  (0, _inherits3.default)(BlockquoteInsertNewLineCommand, _UICommand);

  function BlockquoteInsertNewLineCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, BlockquoteInsertNewLineCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = BlockquoteInsertNewLineCommand.__proto__ || (0, _getPrototypeOf2.default)(BlockquoteInsertNewLineCommand)).call.apply(_ref, [this].concat(args))), _this), _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;

      var tr = insertNewLine(state.tr.setSelection(selection), schema);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return BlockquoteInsertNewLineCommand;
}(_UICommand3.default);

exports.default = BlockquoteInsertNewLineCommand;