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

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _SetDocAttrStep = require('./SetDocAttrStep');

var _SetDocAttrStep2 = _interopRequireDefault(_SetDocAttrStep);

var _DocLayoutEditor = require('./ui/DocLayoutEditor');

var _DocLayoutEditor2 = _interopRequireDefault(_DocLayoutEditor);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocLayoutEditorValue = require('./ui/DocLayoutEditor').babelPluginFlowReactPropTypes_proptype_DocLayoutEditorValue || require('prop-types').any;

function setDocLayout(tr, schema, width, layout) {
  var _tr = tr,
      doc = _tr.doc;

  if (!doc) {
    return tr;
  }

  tr = tr.step(new _SetDocAttrStep2.default('width', width || null));
  tr = tr.step(new _SetDocAttrStep2.default('layout', layout || null));
  return tr;
}

var DocLayoutCommand = function (_UICommand) {
  (0, _inherits3.default)(DocLayoutCommand, _UICommand);

  function DocLayoutCommand() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocLayoutCommand);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocLayoutCommand.__proto__ || (0, _getPrototypeOf2.default)(DocLayoutCommand)).call.apply(_ref, [this].concat(args))), _this), _this._popUp = null, _this.isEnabled = function (state) {
      return true;
    }, _this.isActive = function (state) {
      return !!_this._popUp;
    }, _this.waitForUserInput = function (state, dispatch, view, event) {
      if (_this._popUp) {
        return _promise2.default.resolve(undefined);
      }

      var doc = state.doc;


      return new _promise2.default(function (resolve) {
        var props = {
          initialValue: doc.attrs
        };
        _this._popUp = (0, _createPopUp2.default)(_DocLayoutEditor2.default, props, {
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
        var selection = state.selection,
            schema = state.schema;
        var _tr2 = state.tr;
        // tr = view ? hideCursorPlaceholder(view.state) : tr;

        _tr2 = _tr2.setSelection(selection);

        if (inputs) {
          var width = inputs.width,
              layout = inputs.layout;

          _tr2 = setDocLayout(_tr2, schema, width, layout);
        }
        dispatch(_tr2);
        view && view.focus();
      }

      return false;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return DocLayoutCommand;
}(_UICommand3.default);

exports.default = DocLayoutCommand;