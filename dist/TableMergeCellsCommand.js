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

var _prosemirrorTables = require('prosemirror-tables');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBlankParagraphNode(node) {
  if (!node) {
    return false;
  }
  if (node.type.name !== _NodeNames.PARAGRAPH) {
    return false;
  }
  var firstChild = node.firstChild,
      lastChild = node.lastChild;

  if (!firstChild) {
    return true;
  }
  if (firstChild !== lastChild) {
    return false;
  }
  return firstChild.type.name === _NodeNames.TEXT && firstChild.text === ' ';
}

function purgeConsecutiveBlankParagraphNodes(tr, schema) {
  var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  var cell = schema.nodes[_NodeNames.TABLE_CELL];
  if (!paragraph || !cell) {
    return tr;
  }
  var _tr = tr,
      doc = _tr.doc,
      selection = _tr.selection;

  if (!selection instanceof _prosemirrorTables.CellSelection) {
    return tr;
  }
  var from = selection.from,
      to = selection.to;

  var paragraphPoses = [];
  doc.nodesBetween(from, to, function (node, pos, parentNode) {
    if (node.type === paragraph && parentNode.type === cell) {
      if (isBlankParagraphNode(node)) {
        var $pos = tr.doc.resolve(pos);
        if (isBlankParagraphNode($pos.nodeBefore)) {
          paragraphPoses.push(pos);
        }
      }
      return false;
    } else {
      return true;
    }
  });
  paragraphPoses.reverse().forEach(function (pos) {
    var cell = tr.doc.nodeAt(pos);
    tr = tr.delete(pos, pos + cell.nodeSize);
  });
  return tr;
}

var TableMergeCellsCommand = function (_UICommand) {
  (0, _inherits3.default)(TableMergeCellsCommand, _UICommand);

  function TableMergeCellsCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TableMergeCellsCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TableMergeCellsCommand.__proto__ || (0, _getPrototypeOf2.default)(TableMergeCellsCommand)).call.apply(_ref, [this].concat(args))), _this), _this.execute = function (state, dispatch, view) {
      var tr = state.tr,
          schema = state.schema,
          selection = state.selection;

      var endTr = tr;
      if (selection instanceof _prosemirrorTables.CellSelection) {
        (0, _prosemirrorTables.mergeCells)(state, function (nextTr) {
          endTr = nextTr;
        }, view);
        // Also merge onsecutive blank paragraphs into one.
        endTr = purgeConsecutiveBlankParagraphNodes(endTr, schema);
      }
      var changed = endTr.docChanged || endTr !== tr;
      changed && dispatch && dispatch(endTr);
      return changed;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return TableMergeCellsCommand;
}(_UICommand3.default);

exports.default = TableMergeCellsCommand;