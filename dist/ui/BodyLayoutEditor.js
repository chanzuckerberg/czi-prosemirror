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

require('./czi-body-layout-editor.css');

require('./czi-form.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _CustomRadioButton = require('./CustomRadioButton');

var _CustomRadioButton2 = _interopRequireDefault(_CustomRadioButton);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _BodyNodeSpec = require('../BodyNodeSpec');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_BodyLayoutEditorValue', {
  value: require('prop-types').shape({
    layout: require('prop-types').string,
    width: require('prop-types').number
  })
});

var BodyLayoutEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(BodyLayoutEditor, _React$PureComponent);

  function BodyLayoutEditor(props, context) {
    (0, _classCallCheck3.default)(this, BodyLayoutEditor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BodyLayoutEditor.__proto__ || (0, _getPrototypeOf2.default)(BodyLayoutEditor)).call(this, props, context));

    _this._unmounted = false;

    _this._onSelect = function (selectedValue) {
      _this.setState({ selectedValue: selectedValue });
    };

    _this._cancel = function () {
      _this.props.close();
    };

    _this._apply = function () {
      var selectedValue = _this.state.selectedValue;

      if (typeof selectedValue === 'string') {
        _this.props.close({ width: null, layout: selectedValue });
      } else {
        _this.props.close({ width: selectedValue, layout: null });
      }
    };

    var _ref = _this.props.initialValue || {},
        width = _ref.width,
        layout = _ref.layout;

    _this.state = {
      width: width,
      layout: layout,
      selectedValue: width || layout || _BodyNodeSpec.LAYOUT.US_LETTER_PORTRAIT
    };
    return _this;
  }

  (0, _createClass3.default)(BodyLayoutEditor, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          width = _state.width,
          layout = _state.layout,
          selectedValue = _state.selectedValue;

      var customOption = width ? _react2.default.createElement(_CustomRadioButton2.default, {
        checked: selectedValue === width,
        key: 'c',
        label: 'Custom width: ' + width + 'pt',
        onSelect: this._onSelect,
        value: width
      }) : null;

      return _react2.default.createElement(
        'div',
        { className: 'czi-body-layout-editor' },
        _react2.default.createElement(
          'form',
          { className: 'czi-form' },
          _react2.default.createElement(
            'fieldset',
            null,
            _react2.default.createElement(
              'legend',
              null,
              'Page Layout'
            ),
            _react2.default.createElement(_CustomRadioButton2.default, {
              checked: selectedValue === _BodyNodeSpec.LAYOUT.US_LETTER_PORTRAIT,
              label: 'US Letter - Portrait',
              onSelect: this._onSelect,
              value: _BodyNodeSpec.LAYOUT.US_LETTER_PORTRAIT
            }),
            _react2.default.createElement(_CustomRadioButton2.default, {
              checked: selectedValue === _BodyNodeSpec.LAYOUT.US_LETTER_LANDSCAPE,
              label: 'US Letter - Landscape',
              onSelect: this._onSelect,
              value: _BodyNodeSpec.LAYOUT.US_LETTER_LANDSCAPE
            }),
            _react2.default.createElement(_CustomRadioButton2.default, {
              checked: selectedValue === _BodyNodeSpec.LAYOUT.DESKTOP_SCREEN_4_3,
              label: '4:3 Desktop Screen',
              onSelect: this._onSelect,
              value: _BodyNodeSpec.LAYOUT.DESKTOP_SCREEN_4_3
            }),
            _react2.default.createElement(_CustomRadioButton2.default, {
              checked: selectedValue === _BodyNodeSpec.LAYOUT.DESKTOP_SCREEN_16_9,
              label: '16:9 Desktop Screen',
              onSelect: this._onSelect,
              value: _BodyNodeSpec.LAYOUT.DESKTOP_SCREEN_16_9
            }),
            customOption
          ),
          _react2.default.createElement('hr', null),
          _react2.default.createElement(
            'div',
            { className: 'czi-form-buttons' },
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Cancel',
              onClick: this._cancel
            }),
            _react2.default.createElement(_CustomButton2.default, {
              active: true,
              label: 'Apply',
              onClick: this._apply
            })
          )
        )
      );
    }
  }]);
  return BodyLayoutEditor;
}(_react2.default.PureComponent);

exports.default = BodyLayoutEditor;