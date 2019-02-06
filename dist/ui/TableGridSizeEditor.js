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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _htmlElementToRect = require('./htmlElementToRect');

var _htmlElementToRect2 = _interopRequireDefault(_htmlElementToRect);

var _rects = require('./rects');

require('./czi-table-grid-size-editor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_TableGridSizeEditorValue', {
  value: require('prop-types').shape({
    cols: require('prop-types').number.isRequired,
    rows: require('prop-types').number.isRequired
  })
});


var GUTTER_SIZE = 5;
var CELL_SIZE = 16;
var MAX_SIZE = 20;

var GridCell = function (_React$PureComponent) {
  (0, _inherits3.default)(GridCell, _React$PureComponent);

  function GridCell() {
    (0, _classCallCheck3.default)(this, GridCell);
    return (0, _possibleConstructorReturn3.default)(this, (GridCell.__proto__ || (0, _getPrototypeOf2.default)(GridCell)).apply(this, arguments));
  }

  (0, _createClass3.default)(GridCell, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          x = _props.x,
          y = _props.y,
          selected = _props.selected;

      var style = {
        left: x + 'px',
        top: y + 'px',
        width: CELL_SIZE + 'px',
        height: CELL_SIZE + 'px'
      };
      var className = (0, _classnames2.default)('czi-table-grid-size-editor-cell', {
        selected: selected
      });
      return _react2.default.createElement('div', {
        className: className,
        style: style
      });
    }
  }]);
  return GridCell;
}(_react2.default.PureComponent);

var TableGridSizeEditor = function (_React$PureComponent2) {
  (0, _inherits3.default)(TableGridSizeEditor, _React$PureComponent2);

  function TableGridSizeEditor() {
    var _ref;

    var _temp, _this2, _ret;

    (0, _classCallCheck3.default)(this, TableGridSizeEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref = TableGridSizeEditor.__proto__ || (0, _getPrototypeOf2.default)(TableGridSizeEditor)).call.apply(_ref, [this].concat(args))), _this2), _this2._ex = 0, _this2._ey = 0, _this2._mx = 0, _this2._my = 0, _this2._rafID = 0, _this2._ref = null, _this2._entered = false, _this2.state = {
      rows: 1,
      cols: 1
    }, _this2._onRef = function (ref) {
      _this2._ref = ref;
    }, _this2._onMouseEnter = function (e) {
      var node = e.currentTarget;
      if (node instanceof HTMLElement) {
        var rect = (0, _rects.fromHTMlElement)(node);
        var mx = Math.round(e.clientX);
        var my = Math.round(e.clientY);
        _this2._ex = rect.x;
        _this2._ey = rect.y;
        _this2._mx = mx;
        _this2._my = my;
        if (!_this2._entered) {
          _this2._entered = true;
          document.addEventListener('mousemove', _this2._onMouseMove, true);
        }
      }
    }, _this2._onMouseMove = function (e) {
      var el = _this2._ref && _reactDom2.default.findDOMNode(_this2._ref);
      var elRect = el ? (0, _htmlElementToRect2.default)(el) : null;
      var mouseRect = (0, _rects.fromXY)(e.screenX, e.screenY, 10);

      if (elRect && mouseRect && (0, _rects.isIntersected)(elRect, mouseRect, 50)) {
        // This prevents `PopUpManager` from collapsing the editor.
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      var mx = Math.round(e.clientX);
      var my = Math.round(e.clientY);
      if (mx !== _this2._mx || my !== _this2._my) {
        _this2._mx = mx;
        _this2._my = my;
        _this2._rafID && cancelAnimationFrame(_this2._rafID);
        _this2._rafID = requestAnimationFrame(_this2._updateGridSize);
      }
    }, _this2._updateGridSize = function () {
      _this2._rafID = 0;
      var mx = _this2._mx;
      var my = _this2._my;
      var x = mx - _this2._ex;
      var y = my - _this2._ey;
      var rr = (0, _clamp2.default)(1, Math.ceil(y / (CELL_SIZE + GUTTER_SIZE)), MAX_SIZE);
      var cc = (0, _clamp2.default)(1, Math.ceil(x / (CELL_SIZE + GUTTER_SIZE)), MAX_SIZE);
      var _this2$state = _this2.state,
          rows = _this2$state.rows,
          cols = _this2$state.cols;

      if (rows !== rr || cols !== cc) {
        _this2.setState({ rows: rr, cols: cc });
      }
    }, _this2._onMouseDown = function (e) {
      e.preventDefault();
      _this2.props.close(_this2.state);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this2, _ret);
  }

  (0, _createClass3.default)(TableGridSizeEditor, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._entered) {
        document.removeEventListener('mousemove', this._onMouseMove, true);
      }
      this._rafID && cancelAnimationFrame(this._rafID);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          rows = _state.rows,
          cols = _state.cols;

      var rr = Math.max(5, rows);
      var cc = Math.max(5, cols);
      if (rr === rows) {
        rr = Math.min(MAX_SIZE, rr + 1);
      }
      if (cc === cols) {
        cc = Math.min(MAX_SIZE, cc + 1);
      }
      var cells = [];
      var ii = 0;
      var y = 0;
      var w = 0;
      var h = 0;
      while (ii < rr) {
        y += GUTTER_SIZE;
        var jj = 0;
        var x = 0;
        while (jj < cc) {
          x += GUTTER_SIZE;
          var selected = ii < rows && jj < cols;
          cells.push(_react2.default.createElement(GridCell, {
            key: String(ii) + '-' + String(jj),
            selected: selected,
            x: x,
            y: y
          }));
          x += CELL_SIZE;
          w = x + GUTTER_SIZE;
          jj++;
        }
        y += CELL_SIZE;
        h = y + GUTTER_SIZE;
        ii++;
      }
      var bodyStyle = { width: w + 'px', height: h + 'px' };

      return _react2.default.createElement(
        'div',
        { className: 'czi-table-grid-size-editor', ref: this._onRef },
        _react2.default.createElement(
          'div',
          {
            className: 'czi-table-grid-size-editor-body',
            onMouseDown: this._onMouseDown,
            onMouseEnter: this._onMouseEnter,
            style: bodyStyle },
          cells
        ),
        _react2.default.createElement(
          'div',
          { className: 'czi-table-grid-size-editor-footer' },
          rows,
          ' X ',
          cols
        )
      );
    }
  }]);
  return TableGridSizeEditor;
}(_react2.default.PureComponent);

exports.default = TableGridSizeEditor;