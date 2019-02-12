'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _findActionableCell = require('./findActionableCell');

var _findActionableCell2 = _interopRequireDefault(_findActionableCell);

var _PopUpPosition = require('./ui/PopUpPosition');

var _TableCellTooltip = require('./ui/TableCellTooltip');

var _TableCellTooltip2 = _interopRequireDefault(_TableCellTooltip);

var _createPopUp = require('./ui/createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _rects = require('./ui/rects');

require('./ui/czi-pop-up.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isElementFullyVisible(el) {
  var _fromHTMlElement = (0, _rects.fromHTMlElement)(el),
      x = _fromHTMlElement.x,
      y = _fromHTMlElement.y,
      w = _fromHTMlElement.w,
      h = _fromHTMlElement.h;
  // Only checks the top-left point.


  var nwEl = w && h ? document.elementFromPoint(x + 1, y + 1) : null;
  if (!nwEl) {
    return false;
  }

  if (nwEl === el) {
    return true;
  }

  if (el.contains(nwEl)) {
    return true;
  }

  return false;
}
/* eslint-disable-next-line */


var TableCellTooltipView = function () {
  function TableCellTooltipView(editorView) {
    var _this = this;

    (0, _classCallCheck3.default)(this, TableCellTooltipView);
    this._popUp = null;

    this.destroy = function () {
      _this._popUp && _this._popUp.close();
      _this._popUp = null;
    };

    this._onClose = function () {
      _this._popUp = null;
    };

    this.update(editorView, null);
  }

  (0, _createClass3.default)(TableCellTooltipView, [{
    key: 'update',
    value: function update(view, lastState) {
      var state = view.state,
          readOnly = view.readOnly;

      var result = (0, _findActionableCell2.default)(state);

      if (!result || readOnly) {
        this.destroy();
        return;
      }

      // These is screen coordinate.
      var domFound = view.domAtPos(result.pos + 1);
      if (!domFound) {
        this.destroy();
        return;
      }

      var cellEl = domFound.node;
      var popUp = this._popUp;
      var viewPops = {
        editorState: state,
        editorView: view
      };

      if (cellEl && !isElementFullyVisible(cellEl)) {
        cellEl = null;
      }

      if (!cellEl) {
        // Closes the popup.
        popUp && popUp.close();
        this._cellElement = null;
      } else if (popUp && cellEl === this._cellElement) {
        // Updates the popup.
        popUp.update(viewPops);
      } else {
        // Creates a new popup.
        popUp && popUp.close();
        this._cellElement = cellEl;
        this._popUp = (0, _createPopUp2.default)(_TableCellTooltip2.default, viewPops, {
          anchor: cellEl,
          autoDismiss: false,
          onClose: this._onClose,
          position: _PopUpPosition.atAnchorTopRight
        });
      }
    }
  }]);
  return TableCellTooltipView;
}();

// https://prosemirror.net/examples/tooltip/


var SPEC = {
  view: function view(editorView) {
    return new TableCellTooltipView(editorView);
  }
};

var TableCellTooltipPlugin = function (_Plugin) {
  (0, _inherits3.default)(TableCellTooltipPlugin, _Plugin);

  function TableCellTooltipPlugin() {
    (0, _classCallCheck3.default)(this, TableCellTooltipPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (TableCellTooltipPlugin.__proto__ || (0, _getPrototypeOf2.default)(TableCellTooltipPlugin)).call(this, SPEC));
  }

  return TableCellTooltipPlugin;
}(_prosemirrorState.Plugin);

exports.default = TableCellTooltipPlugin;