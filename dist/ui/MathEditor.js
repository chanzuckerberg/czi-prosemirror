'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

require('./czi-form.css');

require('./czi-math-editor.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MathValue = require('../Types').babelPluginFlowReactPropTypes_proptype_MathValue || require('prop-types').any;

// This file is manually built and uploaded to S3.
// See https://github.com/FB-PLP/react-math-input-app
var GUPPY_CDN_URL = '//cdn.summitlearning.org/assets/app_react_math_input_app_0_0_3_8.html';

var MathEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(MathEditor, _React$PureComponent);

  function MathEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MathEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MathEditor.__proto__ || (0, _getPrototypeOf2.default)(MathEditor)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      value: (0, _assign2.default)({}, _this.props.initialValue || {}),
      contentHeight: 0,
      contentWidth: 0,
      showGuide: false,
      symbolsGuide: null
    }, _this._id = (0, _uuid2.default)(), _this._unmounted = false, _this._onMessage = function (e) {
      var data = void 0;
      try {
        data = JSON.parse(e.data);
      } catch (ex) {
        return;
      }
      if (!data || !data.detail || data.detail.id !== _this._id) {
        return;
      }

      var detail = data.detail;
      var value = detail.value,
          contentLayout = detail.contentLayout,
          symbolsGuide = detail.symbolsGuide;

      if (!_this.state.symbolsGuide) {
        _this.setState({
          symbolsGuide: symbolsGuide
        });
      }
      _this.setState({
        contentHeight: contentLayout.height,
        contentWidth: contentLayout.width,
        value: value
      });
    }, _this._cancel = function () {
      _this.props.close();
    }, _this._insert = function () {
      _this.props.close(_this.state.value);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(MathEditor, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          value = _state.value,
          contentHeight = _state.contentHeight,
          contentWidth = _state.contentWidth,
          symbolsGuide = _state.symbolsGuide;
      var xml = value.xml;


      var id = this._id;
      var params = (0, _stringify2.default)({ value: value, id: id });

      // The math input must be hosted as a sandboxed app because it observe
      // DOM events at global level and it does not release the event handlers
      // when the editor is closed.
      var iframeSrc = GUPPY_CDN_URL + '#' + window.encodeURIComponent(params);
      var iframeStyle = {
        height: Math.max(contentHeight, 80) + 'px',
        width: Math.max(contentWidth, 500) + 'px',
        opacity: symbolsGuide ? 1 : 0
      };

      var className = (0, _classnames2.default)('czi-math-editor');

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(
          'form',
          { className: 'czi-form' },
          _react2.default.createElement(
            'fieldset',
            null,
            _react2.default.createElement(
              'legend',
              null,
              'Insert Math'
            ),
            _react2.default.createElement('iframe', {
              className: 'czi-math-editor-iframe',
              src: iframeSrc,
              style: iframeStyle
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'czi-form-buttons' },
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Cancel',
              onClick: this._cancel
            }),
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Insert',
              onClick: this._insert
            })
          )
        )
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('message', this._onMessage, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      window.removeEventListener('message', this._onMessage, false);
    }
  }]);
  return MathEditor;
}(_react2.default.PureComponent);

exports.default = MathEditor;