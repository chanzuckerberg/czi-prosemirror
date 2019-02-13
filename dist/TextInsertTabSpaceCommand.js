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
      var selection = state.selection,
          schema = state.schema,
          tr = state.tr;

      if (!selection.empty || !(selection instanceof _prosemirrorState.TextSelection)) {
        return false;
      }
      var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
      var heading = schema.nodes[_NodeNames.HEADING];
      var listItem = schema.nodes[_NodeNames.LIST_ITEM];

      var found = listItem && (0, _prosemirrorUtils.findParentNodeOfType)(listItem)(selection) || paragraph && (0, _prosemirrorUtils.findParentNodeOfType)(paragraph)(selection) || heading && (0, _prosemirrorUtils.findParentNodeOfType)(heading)(selection);

      if (!found) {
        return false;
      }

      var from = selection.from,
          to = selection.to;


      if (found.node.type === listItem && found.pos === from - 2) {
        // Cursur is at te begin of the list-item, let the default indentation
        // behavior happen.
        return false;
      }

      if (dispatch) {
        // `\u00a0` is NO-BREAK SPACE.
        // 4 spaces for tab.
        var textNode = schema.text('\xA0\xA0\xA0\xA0');
        dispatch(tr.insert(to, _prosemirrorModel.Fragment.from(textNode)));
      }

      return true;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return TextInsertTabSpaceCommand;
}(_UICommand3.default);

exports.default = TextInsertTabSpaceCommand;