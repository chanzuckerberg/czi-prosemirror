'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

require('./czi-inline-editor.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _CustomEditorView = require('./CustomEditorView');

var _CustomEditorView2 = _interopRequireDefault(_CustomEditorView);

var _CustomNodeView = require('./CustomNodeView');

var _CustomNodeView2 = _interopRequireDefault(_CustomNodeView);

var _MathEditor = require('./MathEditor');

var _MathEditor2 = _interopRequireDefault(_MathEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createPopUp = require('./createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MathAlignValues = {
  NONE: {
    value: null,
    text: 'Inline'
  },
  // LEFT: {
  //   value: 'left',
  //   text: 'Float left',
  // },
  CENTER: {
    value: 'center',
    text: 'Break text'
  }
  // RIGHT: {
  //   value: 'right',
  //   text: 'Float right',
  // },
};

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_MathInlineEditorValue', {
  value: require('prop-types').shape({
    align: require('prop-types').string,
    latex: require('prop-types').string.isRequired
  })
});

var MathInlineEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(MathInlineEditor, _React$PureComponent);

  function MathInlineEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MathInlineEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MathInlineEditor.__proto__ || (0, _getPrototypeOf2.default)(MathInlineEditor)).call.apply(_ref, [this].concat(args))), _this), _this._popUp = null, _this._onClick = function (align) {
      var value = _this.props.value || {};
      _this.props.onSelect((0, _extends3.default)({}, value, { align: align }));
    }, _this._editLatex = function (latex) {
      if (_this._popUp) {
        return;
      }
      var _this$props = _this.props,
          editorView = _this$props.editorView,
          value = _this$props.value;

      var props = {
        runtime: editorView ? editorView.runtime : null,
        initialValue: value && value.latex || ''
      };
      _this._popUp = (0, _createPopUp2.default)(_MathEditor2.default, props, {
        modal: true,
        onClose: function onClose(latex) {
          if (_this._popUp) {
            _this._popUp = null;
            if (latex !== undefined) {
              var _value = _this.props.value || {};
              _this.props.onSelect((0, _extends3.default)({}, _value, { latex: latex }));
            }
          }
        }
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(MathInlineEditor, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._popUp && this._popUp.close();
    }
  }, {
    key: 'render',
    value: function render() {
      var _ref2 = this.props.value || {},
          align = _ref2.align,
          latex = _ref2.latex;

      var onClick = this._onClick;
      var buttons = (0, _keys2.default)(MathAlignValues).map(function (key) {
        var _MathAlignValues$key = MathAlignValues[key],
            value = _MathAlignValues$key.value,
            text = _MathAlignValues$key.text;

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
        { className: 'czi-inline-editor' },
        buttons,
        _react2.default.createElement(_CustomButton2.default, {
          key: 'edit',
          label: 'Edit',
          value: latex || '',
          onClick: this._editLatex
        })
      );
    }
  }]);
  return MathInlineEditor;
}(_react2.default.PureComponent);

exports.default = MathInlineEditor;