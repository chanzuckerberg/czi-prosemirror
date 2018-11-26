'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

require('./czi-image-url-editor.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _resolveImage = require('./resolveImage');

var _resolveImage2 = _interopRequireDefault(_resolveImage);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ImageURLEditorValue', {
  value: require('prop-types').shape({
    height: require('prop-types').number,
    src: require('prop-types').string,
    width: require('prop-types').number
  })
});

var ImageURLEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(ImageURLEditor, _React$PureComponent);

  function ImageURLEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageURLEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageURLEditor.__proto__ || (0, _getPrototypeOf2.default)(ImageURLEditor)).call.apply(_ref, [this].concat(args))), _this), _this._img = null, _this._unmounted = false, _this.state = (0, _extends3.default)({}, _this.props.initialValue || {}, {
      validValue: null
    }), _this._onSrcChange = function (e) {
      var src = e.target.value;
      _this.setState({
        src: src,
        validValue: null
      }, _this._didSrcChange);
    }, _this._didSrcChange = function () {
      (0, _resolveImage2.default)(_this.state.src).then(function (result) {
        if (_this.state.src === result.src && !_this._unmounted) {
          var validValue = result.complete ? result : null;
          _this.setState({ validValue: validValue });
        }
      });
    }, _this._cancel = function () {
      _this.props.close();
    }, _this._insert = function () {
      var validValue = _this.state.validValue;

      _this.props.close(validValue);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ImageURLEditor, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          src = _state.src,
          validValue = _state.validValue;

      var preview = validValue ? _react2.default.createElement('div', {
        className: 'czi-image-url-editor-input-preview',
        style: { backgroundImage: 'url(' + String(validValue.src) }
      }) : null;

      return _react2.default.createElement(
        'div',
        { className: 'czi-image-url-editor' },
        _react2.default.createElement(
          'form',
          { className: 'czi-form' },
          _react2.default.createElement(
            'fieldset',
            null,
            _react2.default.createElement(
              'legend',
              null,
              'Insert Image'
            ),
            _react2.default.createElement(
              'div',
              { className: 'czi-image-url-editor-src-input-row' },
              _react2.default.createElement('input', {
                autoFocus: true,
                className: 'czi-image-url-editor-src-input',
                onChange: this._onSrcChange,
                type: 'text', placeholder: 'Paste URL of Image...',
                value: src || ''
              }),
              preview
            ),
            _react2.default.createElement(
              'em',
              null,
              'Only select image that you have confirmed the license to use'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'czi-form-buttons' },
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Cancel',
              onClick: this._cancel
            }),
            _react2.default.createElement(_CustomButton2.default, {
              active: !!validValue,
              disabled: !validValue,
              label: 'Insert',
              onClick: this._insert
            })
          )
        )
      );
    }
  }]);
  return ImageURLEditor;
}(_react2.default.PureComponent);

exports.default = ImageURLEditor;