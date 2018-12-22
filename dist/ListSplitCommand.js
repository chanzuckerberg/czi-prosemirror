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

var _splitListItem = require('./splitListItem');

var _splitListItem2 = _interopRequireDefault(_splitListItem);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListSplitCommand = function (_UICommand) {
  (0, _inherits3.default)(ListSplitCommand, _UICommand);

  function ListSplitCommand(schema) {
    (0, _classCallCheck3.default)(this, ListSplitCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ListSplitCommand.__proto__ || (0, _getPrototypeOf2.default)(ListSplitCommand)).call(this));

    _initialiseProps.call(_this);

    return _this;
  }

  return ListSplitCommand;
}(_UICommand3.default);

var _initialiseProps = function _initialiseProps() {
  this.execute = function (state, dispatch, view) {
    var selection = state.selection,
        schema = state.schema;

    var tr = (0, _splitListItem2.default)(state.tr.setSelection(selection), schema);
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
};

exports.default = ListSplitCommand;