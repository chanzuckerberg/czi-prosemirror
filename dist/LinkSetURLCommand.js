'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _LinkURLEditor = require('./ui/LinkURLEditor');

var _LinkURLEditor2 = _interopRequireDefault(_LinkURLEditor);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _applyMark = require('./applyMark');

var _applyMark2 = _interopRequireDefault(_applyMark);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _findNodesWithSameMark = require('./findNodesWithSameMark');

var _findNodesWithSameMark2 = _interopRequireDefault(_findNodesWithSameMark);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _MarkNames = require('./MarkNames');

var _prosemirrorTransform = require('prosemirror-transform');

var _SelectionPlaceholderPlugin = require('./SelectionPlaceholderPlugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LinkSetURLCommand = function (_UICommand) {
  (0, _inherits3.default)(LinkSetURLCommand, _UICommand);

  function LinkSetURLCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LinkSetURLCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = LinkSetURLCommand.__proto__ || (0, _getPrototypeOf2.default)(LinkSetURLCommand)).call.apply(_ref, [this].concat(args))), _this), _this._popUp = null, _this.isEnabled = function (state) {
      if (!(state.selection instanceof _prosemirrorState.TextSelection)) {
        // Could be a NodeSelection or CellSelection.
        return false;
      }

      var markType = state.schema.marks[_MarkNames.MARK_LINK];
      if (!markType) {
        return false;
      }
      var _state$selection = state.selection,
          from = _state$selection.from,
          to = _state$selection.to;

      return from < to;
    }, _this.waitForUserInput = function (state, dispatch, view, event) {
      if (_this._popUp) {
        return _promise2.default.resolve(undefined);
      }

      if (dispatch) {
        dispatch((0, _SelectionPlaceholderPlugin.showSelectionPlaceholder)(state));
      }

      var doc = state.doc,
          schema = state.schema,
          selection = state.selection;

      var markType = schema.marks[_MarkNames.MARK_LINK];
      if (!markType) {
        return _promise2.default.resolve(undefined);
      }
      var from = selection.from,
          to = selection.to;

      var result = (0, _findNodesWithSameMark2.default)(doc, from, to, markType);
      var href = result ? result.mark.attrs.href : null;
      return new _promise2.default(function (resolve) {
        _this._popUp = (0, _createPopUp2.default)(_LinkURLEditor2.default, { href: href }, {
          modal: true,
          onClose: function onClose(val) {
            if (_this._popUp) {
              _this._popUp = null;
              resolve(val);
            }
          }
        });
      });
    }, _this.executeWithUserInput = function (state, dispatch, view, href) {
      if (dispatch) {
        var selection = state.selection,
            schema = state.schema;
        var _tr = state.tr;

        _tr = view ? (0, _SelectionPlaceholderPlugin.hideSelectionPlaceholder)(view.state) : _tr;
        _tr = _tr.setSelection(selection);
        if (href !== undefined) {
          var markType = schema.marks[_MarkNames.MARK_LINK];
          var attrs = href ? { href: href } : null;
          _tr = (0, _applyMark2.default)(_tr.setSelection(state.selection), schema, markType, attrs);
        }
        dispatch(_tr);
      }
      view && view.focus();
      return true;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return LinkSetURLCommand;
}(_UICommand3.default);

exports.default = LinkSetURLCommand;