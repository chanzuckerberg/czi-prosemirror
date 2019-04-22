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

var _MarkNames = require('./MarkNames');

var _NodeNames = require('./NodeNames');

var _SpacerMarkSpec = require('./SpacerMarkSpec');

var _applyMark = require('./applyMark');

var _applyMark2 = _interopRequireDefault(_applyMark);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function insertTabSpace(tr, schema) {
  var _tr = tr,
      selection = _tr.selection;

  if (!selection.empty || !(selection instanceof _prosemirrorState.TextSelection)) {
    return tr;
  }

  var markType = schema.marks[_MarkNames.MARK_SPACER];
  if (!markType) {
    return tr;
  }
  var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  var heading = schema.nodes[_NodeNames.HEADING];
  var listItem = schema.nodes[_NodeNames.LIST_ITEM];

  var found = listItem && (0, _prosemirrorUtils.findParentNodeOfType)(listItem)(selection) || paragraph && (0, _prosemirrorUtils.findParentNodeOfType)(paragraph)(selection) || heading && (0, _prosemirrorUtils.findParentNodeOfType)(heading)(selection);

  if (!found) {
    return tr;
  }

  var from = selection.from,
      to = selection.to;


  if (found.node.type === listItem && found.pos === from - 2) {
    // Cursur is at te begin of the list-item, let the default indentation
    // behavior happen.
    return tr;
  }

  var textNode = schema.text(_SpacerMarkSpec.HAIR_SPACE_CHAR);
  tr = tr.insert(to, _prosemirrorModel.Fragment.from(textNode));
  var attrs = {
    size: _SpacerMarkSpec.SPACER_SIZE_TAB
  };

  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, to, to + 1));

  tr = (0, _applyMark2.default)(tr, schema, markType, attrs);

  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, to + 1, to + 1));

  return tr;
}

var TextInsertTabSpaceCommand = function (_UICommand) {
  (0, _inherits3.default)(TextInsertTabSpaceCommand, _UICommand);

  function TextInsertTabSpaceCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TextInsertTabSpaceCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TextInsertTabSpaceCommand.__proto__ || (0, _getPrototypeOf2.default)(TextInsertTabSpaceCommand)).call.apply(_ref, [this].concat(args))), _this), _this.execute = function (state, dispatch, view, event) {
      var schema = state.schema,
          tr = state.tr;

      var trNext = insertTabSpace(tr, schema);
      if (trNext.docChanged) {
        dispatch && dispatch(trNext);
        return true;
      }
      return false;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return TextInsertTabSpaceCommand;
}(_UICommand3.default);

exports.default = TextInsertTabSpaceCommand;