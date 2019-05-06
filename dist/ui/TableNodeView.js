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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTables = require('prosemirror-tables');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// A custom table view that renders the margin-left style.
var TableNodeView = function (_TableView) {
  (0, _inherits3.default)(TableNodeView, _TableView);

  function TableNodeView(node, colMinWidth, view) {
    (0, _classCallCheck3.default)(this, TableNodeView);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TableNodeView.__proto__ || (0, _getPrototypeOf2.default)(TableNodeView)).call(this, node, colMinWidth, view));

    _this._updateMargin(node);
    return _this;
  }

  (0, _createClass3.default)(TableNodeView, [{
    key: 'update',
    value: function update(node) {
      var updated = (0, _get3.default)(TableNodeView.prototype.__proto__ || (0, _getPrototypeOf2.default)(TableNodeView.prototype), 'update', this).call(this, node);
      if (updated) {
        this._updateMargin(node);
      }
      return updated;
    }
  }, {
    key: '_updateMargin',
    value: function _updateMargin(node) {
      var marginLeft = node.attrs && node.attrs.marginLeft || 0;
      this.table.style.marginLeft = marginLeft ? marginLeft + 'px' : '';
    }
  }]);
  return TableNodeView;
}(_prosemirrorTables.TableView);

exports.default = TableNodeView;