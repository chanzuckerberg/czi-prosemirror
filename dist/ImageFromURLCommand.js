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

var _CursorPlaceholderPlugin = require('./CursorPlaceholderPlugin');

var _CursorPlaceholderPlugin2 = _interopRequireDefault(_CursorPlaceholderPlugin);

var _ImageURLEditor = require('./ui/ImageURLEditor');

var _ImageURLEditor2 = _interopRequireDefault(_ImageURLEditor);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _NodeNames = require('./NodeNames');

var _prosemirrorTransform = require('prosemirror-transform');

var _popUpPosition = require('./ui/popUpPosition');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ImageURLEditorValue = require('./ui/ImageURLEditor').babelPluginFlowReactPropTypes_proptype_ImageURLEditorValue || require('prop-types').any;

function insertImage(tr, schema, src) {
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;

  if (!selection) {
    return tr;
  }
  var from = selection.from,
      to = selection.to;

  if (from !== to) {
    return tr;
  }

  var image = schema.nodes[_NodeNames.IMAGE];
  if (!image) {
    return tr;
  }

  var attrs = {
    src: src || '',
    alt: '',
    title: ''
  };

  var prevNode = tr.doc.nodeAt(from);
  var node = image.create(attrs, null, null);
  var frag = _prosemirrorModel.Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

var ImageFromURLCommand = function (_UICommand) {
  (0, _inherits3.default)(ImageFromURLCommand, _UICommand);

  function ImageFromURLCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageFromURLCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageFromURLCommand.__proto__ || (0, _getPrototypeOf2.default)(ImageFromURLCommand)).call.apply(_ref, [this].concat(args))), _this), _this._popUp = null, _this.isEnabled = function (state) {
      var tr = state;
      var selection = state.tr.selection;

      if (selection instanceof _prosemirrorState.TextSelection) {
        return selection.from === selection.to;
      }
      return false;
    }, _this.waitForUserInput = function (state, dispatch, view, event) {
      if (_this._popUp) {
        return _promise2.default.resolve(undefined);
      }

      if (dispatch) {
        dispatch((0, _CursorPlaceholderPlugin.showCursorPlaceholder)(state));
      }

      return new _promise2.default(function (resolve) {
        _this._popUp = (0, _createPopUp2.default)(_ImageURLEditor2.default, null, {
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
        var _tr2 = state.tr,
            selection = state.selection,
            schema = state.schema;

        _tr2 = view ? (0, _CursorPlaceholderPlugin.hideCursorPlaceholder)(view.state) : _tr2;
        _tr2 = _tr2.setSelection(selection);
        if (inputs) {
          var width = inputs.width,
              height = inputs.height,
              src = inputs.src;

          _tr2 = insertImage(_tr2, schema, src);
        }
        dispatch(_tr2);
        view && view.focus();
      }

      return false;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return ImageFromURLCommand;
}(_UICommand3.default);

exports.default = ImageFromURLCommand;