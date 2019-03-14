'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_SIZE = exports.MIN_SIZE = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

require('./czi-image-resize-box.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MIN_SIZE = exports.MIN_SIZE = 20;
var MAX_SIZE = exports.MAX_SIZE = 10000;

function setWidth(el, width, height) {
  el.style.width = width + 'px';
}

function setHeight(el, width, height) {
  el.style.height = height + 'px';
}

function setSize(el, width, height) {
  el.style.width = Math.round(width) + 'px';
  el.style.height = Math.round(height) + 'px';
}

var ResizeDirection = {
  'top': setHeight,
  'top_right': setSize,
  'right': setWidth,
  'bottom_right': setSize,
  'bottom': setHeight,
  'bottom_left': setSize,
  'left': setWidth,
  'top_left': setSize
};

var ImageResizeBoxControl = function (_React$PureComponent) {
  (0, _inherits3.default)(ImageResizeBoxControl, _React$PureComponent);

  function ImageResizeBoxControl() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageResizeBoxControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageResizeBoxControl.__proto__ || (0, _getPrototypeOf2.default)(ImageResizeBoxControl)).call.apply(_ref, [this].concat(args))), _this), _this._active = false, _this._el = null, _this._h = '', _this._rafID = 0, _this._w = '', _this._x1 = 0, _this._x2 = 0, _this._y1 = 0, _this._y2 = 0, _this._ww = 0, _this._hh = 0, _this._syncSize = function () {
      if (!_this._active) {
        return;
      }
      var _this$props = _this.props,
          direction = _this$props.direction,
          width = _this$props.width,
          height = _this$props.height;


      var dx = (_this._x2 - _this._x1) * (/left/.test(direction) ? -1 : 1);
      var dy = (_this._y2 - _this._y1) * (/top/.test(direction) ? -1 : 1);

      var el = (0, _nullthrows2.default)(_this._el);
      var fn = (0, _nullthrows2.default)(ResizeDirection[direction]);
      var aspect = width / height;
      var ww = (0, _clamp2.default)(MIN_SIZE, width + Math.round(dx), MAX_SIZE);
      var hh = (0, _clamp2.default)(MIN_SIZE, height + Math.round(dy), MAX_SIZE);

      if (fn === setSize) {
        hh = Math.max(ww / aspect, MIN_SIZE);
        ww = hh * aspect;
      }

      fn(el, Math.round(ww), Math.round(hh));
      _this._ww = ww;
      _this._hh = hh;
    }, _this._onMouseDown = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this._end();
      _this._start(e);
    }, _this._onMouseMove = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this._x2 = e.clientX;
      _this._y2 = e.clientY;
      _this._rafID = requestAnimationFrame(_this._syncSize);
    }, _this._onMouseUp = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this._x2 = e.clientX;
      _this._y2 = e.clientY;

      var direction = _this.props.direction;

      var el = (0, _nullthrows2.default)(_this._el);
      el.classList.remove(direction);

      _this._end();
      _this.props.onResizeEnd(_this._ww, _this._hh);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ImageResizeBoxControl, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._end();
    }
  }, {
    key: 'render',
    value: function render() {
      var direction = this.props.direction;


      var className = (0, _classnames2.default)((0, _defineProperty3.default)({
        'czi-image-resize-box-control': true
      }, direction, true));

      return _react2.default.createElement('span', {
        className: className,
        onMouseDown: this._onMouseDown
      });
    }
  }, {
    key: '_start',
    value: function _start(e) {
      if (this._active) {
        this._end();
      }

      this._active = true;

      var _props = this.props,
          boxID = _props.boxID,
          direction = _props.direction,
          width = _props.width,
          height = _props.height;

      var el = (0, _nullthrows2.default)(document.getElementById(boxID));
      el.className += ' ' + direction;

      this._el = el;
      this._x1 = e.clientX;
      this._y1 = e.clientY;
      this._x2 = this._x1;
      this._y2 = this._y1;
      this._w = this._el.style.width;
      this._h = this._el.style.height;
      this._ww = width;
      this._hh = height;

      document.addEventListener('mousemove', this._onMouseMove, true);
      document.addEventListener('mouseup', this._onMouseUp, true);
    }
  }, {
    key: '_end',
    value: function _end() {
      if (!this._active) {
        return;
      }

      this._active = false;
      document.removeEventListener('mousemove', this._onMouseMove, true);
      document.removeEventListener('mouseup', this._onMouseUp, true);

      var el = (0, _nullthrows2.default)(this._el);
      el.style.width = this._w;
      el.style.height = this._h;
      el.className = 'czi-image-resize-box';
      this._el = null;

      this._rafID && cancelAnimationFrame(this._rafID);
      this._rafID = null;
    }
  }]);
  return ImageResizeBoxControl;
}(_react2.default.PureComponent);

var ImageResizeBox = function (_React$PureComponent2) {
  (0, _inherits3.default)(ImageResizeBox, _React$PureComponent2);

  function ImageResizeBox() {
    var _ref2;

    var _temp2, _this2, _ret2;

    (0, _classCallCheck3.default)(this, ImageResizeBox);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref2 = ImageResizeBox.__proto__ || (0, _getPrototypeOf2.default)(ImageResizeBox)).call.apply(_ref2, [this].concat(args))), _this2), _this2._id = (0, _uuid2.default)(), _temp2), (0, _possibleConstructorReturn3.default)(_this2, _ret2);
  }

  (0, _createClass3.default)(ImageResizeBox, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          onResizeEnd = _props2.onResizeEnd,
          width = _props2.width,
          height = _props2.height,
          src = _props2.src;


      var style = {
        height: height + 'px',
        width: width + 'px'
      };

      var boxID = this._id;

      var controls = (0, _keys2.default)(ResizeDirection).map(function (key) {
        return _react2.default.createElement(ImageResizeBoxControl, {
          boxID: boxID,
          config: ResizeDirection[key],
          direction: key,
          height: height,
          key: key,
          onResizeEnd: onResizeEnd,
          width: width
        });
      });

      return _react2.default.createElement(
        'span',
        { className: 'czi-image-resize-box', id: boxID, style: style },
        controls,
        _react2.default.createElement('img', {
          className: 'czi-image-resize-box-image',
          src: src
        })
      );
    }
  }]);
  return ImageResizeBox;
}(_react2.default.PureComponent);

exports.default = ImageResizeBox;