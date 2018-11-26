'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

require('./czi-image-align-editor.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _CustomNodeView = require('./CustomNodeView');

var _CustomNodeView2 = _interopRequireDefault(_CustomNodeView);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageAlignValues = {
  NONE: {
    value: null,
    text: 'Inline'
  },
  LEFT: {
    value: 'left',
    text: 'Float left'
  },
  CENTER: {
    value: 'center',
    text: 'Center'
  },
  RIGHT: {
    value: 'right',
    text: 'Float right'
  }
};

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ImageAlignEditorValue', {
  value: require('prop-types').shape({
    align: require('prop-types').string
  })
});

var ImageAlignEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(ImageAlignEditor, _React$PureComponent);

  function ImageAlignEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageAlignEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageAlignEditor.__proto__ || (0, _getPrototypeOf2.default)(ImageAlignEditor)).call.apply(_ref, [this].concat(args))), _this), _this._onClick = function (align) {
      _this.props.onSelect({ align: align });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ImageAlignEditor, [{
    key: 'render',
    value: function render() {
      var align = this.props.value ? this.props.value.align : null;
      var onClick = this._onClick;
      var buttons = (0, _keys2.default)(ImageAlignValues).map(function (key) {
        var _ImageAlignValues$key = ImageAlignValues[key],
            value = _ImageAlignValues$key.value,
            text = _ImageAlignValues$key.text;

        return _react2.default.createElement(_CustomButton2.default, {
          key: key,
          active: align === value,
          label: text,
          value: value,
          onClick: onClick
        });
      });

      return _react2.default.createElement(
        'div',
        { className: 'czi-image-align-editor custom-' },
        buttons
      );
    }
  }]);
  return ImageAlignEditor;
}(_react2.default.PureComponent);

exports.default = ImageAlignEditor;