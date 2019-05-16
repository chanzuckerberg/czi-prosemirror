'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _smoothScrollIntoViewIfNeeded = require('smooth-scroll-into-view-if-needed');

var _smoothScrollIntoViewIfNeeded2 = _interopRequireDefault(_smoothScrollIntoViewIfNeeded);

var _sanitizeURL = require('../sanitizeURL');

var _sanitizeURL2 = _interopRequireDefault(_sanitizeURL);

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

require('./czi-link-tooltip.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBookmarHref(href) {
  return !!href && href.indexOf('#') === 0 && href.length >= 2;
}

var LinkTooltip = function (_React$PureComponent) {
  (0, _inherits3.default)(LinkTooltip, _React$PureComponent);

  function LinkTooltip() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LinkTooltip);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = LinkTooltip.__proto__ || (0, _getPrototypeOf2.default)(LinkTooltip)).call.apply(_ref, [this].concat(args))), _this), _this._unmounted = false, _this.state = {
      hidden: false
    }, _this._openLink = function (href) {
      if (isBookmarHref(href)) {
        var id = href.substr(1);
        var el = document.getElementById(id);
        if (el) {
          var _this$props = _this.props,
              _onCancel = _this$props.onCancel,
              _editorView = _this$props.editorView;

          _onCancel(_editorView);
          (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _smoothScrollIntoViewIfNeeded2.default)(el, {
                      scrollMode: 'if-needed',
                      // block: 'nearest',
                      // inline: 'nearest',
                      behavior: 'smooth'
                    });

                  case 2:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2);
          }))();
        }
        return;
      }
      if (href) {
        window.open((0, _sanitizeURL2.default)(href));
      }
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

      var useBookMark = isBookmarHref(href);
      var editButton = useBookMark ? null : _react2.default.createElement(_CustomButton2.default, { label: 'Change', onClick: onEdit, value: editorView });

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
              className: useBookMark ? null : 'czi-link-tooltip-href',
              label: useBookMark ? 'Jump To Bookmark' : href,
              onClick: this._openLink,
              target: 'new',
              title: useBookMark ? null : href,
              value: href
            }),
            editButton,
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Remove',
              onClick: onRemove,
              value: editorView
            })
          )
        )
      );
    }
  }]);
  return LinkTooltip;
}(_react2.default.PureComponent);

exports.default = LinkTooltip;