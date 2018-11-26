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

require('./czi-link-tooltip.css');

var _LinkURLEditor = require('./LinkURLEditor');

var _LinkURLEditor2 = _interopRequireDefault(_LinkURLEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _createPopUp = require('./createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorView = require('prosemirror-view');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LinkTooltip = function (_React$PureComponent) {
  (0, _inherits3.default)(LinkTooltip, _React$PureComponent);

  function LinkTooltip() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LinkTooltip);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = LinkTooltip.__proto__ || (0, _getPrototypeOf2.default)(LinkTooltip)).call.apply(_ref, [this].concat(args))), _this), _this._openLink = function (href) {
      window.open(href);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(LinkTooltip, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          href = _props.href,
          editorView = _props.editorView,
          onEdit = _props.onEdit,
          onRemove = _props.onRemove;

      return _react2.default.createElement(
        'div',
        { className: 'czi-link-tooltip' },
        _react2.default.createElement(
          'div',
          { className: 'czi-link-tooltip-body' },
          _react2.default.createElement(
            'div',
            { className: 'czi-link-tooltip-row' },
            _react2.default.createElement(_CustomButton2.default, {
              className: 'czi-link-tooltip-href',
              value: href,
              target: 'new',
              label: href,
              title: href,
              onClick: this._openLink
            }),
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Change',
              value: editorView,
              onClick: onEdit
            }),
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Remove',
              value: editorView,
              onClick: onRemove
            })
          )
        )
      );
    }
  }]);
  return LinkTooltip;
}(_react2.default.PureComponent);

exports.default = LinkTooltip;