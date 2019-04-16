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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
var babelPluginFlowReactPropTypes_proptype_EditorRuntime = require('../Types').babelPluginFlowReactPropTypes_proptype_EditorRuntime || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DirectEditorProps = require('../Types').babelPluginFlowReactPropTypes_proptype_DirectEditorProps || require('prop-types').any;

var CustomEditorView = function (_EditorView) {
  (0, _inherits3.default)(CustomEditorView, _EditorView);

  function CustomEditorView(place, props) {
    (0, _classCallCheck3.default)(this, CustomEditorView);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CustomEditorView.__proto__ || (0, _getPrototypeOf2.default)(CustomEditorView)).call(this, place, props));

    _this.runtime = null;
    _this.readOnly = true;
    _this.disabled = true;
    _this.placeholder = null;
    return _this;
  }

  (0, _createClass3.default)(CustomEditorView, [{
    key: 'destroy',
    value: function destroy() {
      (0, _get3.default)(CustomEditorView.prototype.__proto__ || (0, _getPrototypeOf2.default)(CustomEditorView.prototype), 'destroy', this).call(this);
      this._props = {};
    }
  }]);
  return CustomEditorView;
}(_prosemirrorView.EditorView);

exports.default = CustomEditorView;