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

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function insertHorizontalRule(tr, schema) {
  var _tr = tr,
      selection = _tr.selection;

  if (!selection) {
    return tr;
  }
  var from = selection.from,
      to = selection.to;

  if (from !== to) {
    return tr;
  }

  var horizontalRule = schema.nodes[_NodeNames.HORIZONTAL_RULE];
  if (!horizontalRule) {
    return tr;
  }

  var node = horizontalRule.create({}, null, null);
  var frag = _prosemirrorModel.Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

var HorizontalRuleCommand = function (_UICommand) {
  (0, _inherits3.default)(HorizontalRuleCommand, _UICommand);

  function HorizontalRuleCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, HorizontalRuleCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = HorizontalRuleCommand.__proto__ || (0, _getPrototypeOf2.default)(HorizontalRuleCommand)).call.apply(_ref, [this].concat(args))), _this), _this.execute = function (state, dispatch, view) {
      var selection = state.selection,
          schema = state.schema;

      var tr = insertHorizontalRule(state.tr.setSelection(selection), schema);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return HorizontalRuleCommand;
}(_UICommand3.default);

exports.default = HorizontalRuleCommand;