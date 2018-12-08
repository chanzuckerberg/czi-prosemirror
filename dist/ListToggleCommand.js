'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

var _toggleList = require('./toggleList');

var _toggleList2 = _interopRequireDefault(_toggleList);

var _NodeNames = require('./NodeNames');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/atlassian/prosemirror-utils/tree/master/src
// https://bitbucket.org/atlassian/atlaskit/src/34facee3f46197fefa8b8e22e83afd83d4d48f94/packages/editor-core/src/plugins/lists/?at=master
var ListToggleCommand = function (_UICommand) {
  (0, _inherits3.default)(ListToggleCommand, _UICommand);

  function ListToggleCommand(ordered) {
    (0, _classCallCheck3.default)(this, ListToggleCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ListToggleCommand.__proto__ || (0, _getPrototypeOf2.default)(ListToggleCommand)).call(this));

    _this.isActive = function (state) {
      if (_this._ordered) {
        return !!_this._findList(state, _NodeNames.ORDERED_LIST);
      } else {
        return !!_this._findList(state, _NodeNames.BULLET_LIST);
      }
    };

    _this.execute = function (state, dispatch, view) {
      var selection = state.selection,
          schema = state.schema;

      var nodeType = schema.nodes[_this._ordered ? _NodeNames.ORDERED_LIST : _NodeNames.BULLET_LIST];
      var tr = state.tr;

      if (!nodeType) {
        return tr;
      }

      tr = (0, _toggleList2.default)(tr.setSelection(selection), schema, nodeType);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    };

    _this._ordered = ordered;
    return _this;
  }

  (0, _createClass3.default)(ListToggleCommand, [{
    key: '_findList',
    value: function _findList(state, type) {
      var nodes = state.schema.nodes;

      var list = nodes[type];
      var findList = list ? (0, _prosemirrorUtils.findParentNodeOfType)(list) : _noop2.default;
      return findList(state.selection);
    }
  }]);
  return ListToggleCommand;
}(_UICommand3.default);

exports.default = ListToggleCommand;