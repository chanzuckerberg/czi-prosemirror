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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _BodyLayoutEditor = require('./ui/BodyLayoutEditor');

var _BodyLayoutEditor2 = _interopRequireDefault(_BodyLayoutEditor);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _NodeNames = require('./NodeNames');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _PopUpPosition = require('./ui/PopUpPosition');

var _CursorPlaceholderPlugin = require('./CursorPlaceholderPlugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_BodyLayoutEditorValue = require('./ui/BodyLayoutEditor').babelPluginFlowReactPropTypes_proptype_BodyLayoutEditorValue || require('prop-types').any;

function setBodyLayout(tr, schema, width, layout) {
  var body = schema.nodes[_NodeNames.BODY];
  if (!body) {
    return tr;
  }
  var node = tr.doc && tr.doc.nodeAt(0);
  if (!node || node.type !== body) {
    return tr;
  }
  tr = tr.setNodeMarkup(0, body, (0, _extends3.default)({}, node.attrs, { width: width, layout: layout }), node.marks);
  return tr;
}

var PageSizeCommand = function (_UICommand) {
  (0, _inherits3.default)(PageSizeCommand, _UICommand);

  function PageSizeCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PageSizeCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PageSizeCommand.__proto__ || (0, _getPrototypeOf2.default)(PageSizeCommand)).call.apply(_ref, [this].concat(args))), _this), _this._popUp = null, _this.isEnabled = function (state) {
      var doc = state.doc;

      var node = doc.firstChild;
      if (node && node.type && node.type.name === _NodeNames.BODY) {
        return true;
      }
      return false;
    }, _this.waitForUserInput = function (state, dispatch, view, event) {
      var doc = state.doc;

      var node = doc.firstChild;

      if (!node || !node.type || node.type.name !== _NodeNames.BODY) {
        return _promise2.default.resolve(undefined);
      }

      if (_this._popUp) {
        return _promise2.default.resolve(undefined);
      }

      // if (dispatch) {
      //   dispatch(showCursorPlaceholder(state));
      // }

      return new _promise2.default(function (resolve) {
        var props = {
          initialValue: node.attrs
        };
        _this._popUp = (0, _createPopUp2.default)(_BodyLayoutEditor2.default, props, {
          modal: true,
          onClose: function onClose(val) {
            if (_this._popUp) {
              _this._popUp = null;
              resolve(val);
            }
          }
        });
      });
    }, _this.executeWithUserInput = function (state, dispatch, view, inputs) {
      if (dispatch) {
        var _tr = state.tr,
            selection = state.selection,
            schema = state.schema;
        // tr = view ? hideCursorPlaceholder(view.state) : tr;

        _tr = _tr.setSelection(selection);

        if (inputs) {
          var width = inputs.width,
              layout = inputs.layout;

          _tr = setBodyLayout(_tr, schema, width, layout);
        }
        dispatch(_tr);
        view && view.focus();
      }

      return false;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return PageSizeCommand;
}(_UICommand3.default);

exports.default = PageSizeCommand;