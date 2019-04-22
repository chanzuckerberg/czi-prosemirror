'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _freeze = require('babel-runtime/core-js/object/freeze');

var _freeze2 = _interopRequireDefault(_freeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EMPTY_SELECTION_VALUE = (0, _freeze2.default)({ from: 0, to: 0 });

function resolveSelectionValue(el) {
  if (!window.getSelection) {
    console.warn('window.getSelection() is not supported');
    return EMPTY_SELECTION_VALUE;
  }

  var selection = window.getSelection();
  if (!selection.containsNode) {
    console.warn('selection.containsNode() is not supported');
    return EMPTY_SELECTION_VALUE;
  }

  if (!selection.rangeCount) {
    return EMPTY_SELECTION_VALUE;
  }

  var range = selection.getRangeAt(0);
  if (!range) {
    return EMPTY_SELECTION_VALUE;
  }

  var startContainer = range.startContainer,
      endContainer = range.endContainer,
      startOffset = range.startOffset,
      endOffset = range.endOffset;

  if (startContainer === el || endContainer === el || startContainer && el.contains(startContainer) || endContainer && el.contains(endContainer)) {
    return {
      from: startOffset,
      to: endOffset
    };
  }

  return EMPTY_SELECTION_VALUE;
}

var SelectionObserver = function () {
  function SelectionObserver(callback) {
    (0, _classCallCheck3.default)(this, SelectionObserver);

    _initialiseProps.call(this);

    this._callback = callback;
  }

  (0, _createClass3.default)(SelectionObserver, [{
    key: 'disconnect',
    value: function disconnect() {
      var _this = this;

      this._observables.forEach(function (obj) {
        var el = obj.target;
        el.removeEventListener('click', _this._check, false);
        el.removeEventListener('selectionchange', _this._check, false);
      });
      this._observables = [];
    }
  }, {
    key: 'observe',
    value: function observe(el) {
      if (!window.getSelection) {
        console.warn('window.getSelection() is not supported');
        return;
      }

      if (this._observables.some(function (obj) {
        return obj.target === el;
      })) {
        // Already observed.
        return;
      }

      var obj = {
        target: el,
        selection: resolveSelectionValue(el)
      };

      el.addEventListener('click', this._check, false);
      el.addEventListener('selectionchange', this._check, false);
      this._observables.push(obj);
    }
  }, {
    key: 'takeRecords',
    value: function takeRecords() {
      return this._observables.slice(0);
    }
  }]);
  return SelectionObserver;
}();

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._observables = [];
  this._callback = null;

  this._onClick = function () {
    var callback = _this2._callback;
    _this2._observables = _this2._observables.map(function (obj) {
      var target = obj.target;

      return {
        target: target,
        selection: resolveSelectionValue(target)
      };
    });
    callback && callback(_this2.takeRecords(), _this2);
  };

  this._check = function () {
    var changed = false;
    var callback = _this2._callback;
    _this2._observables = _this2._observables.map(function (obj) {
      var target = obj.target,
          selection = obj.selection;

      var $selection = resolveSelectionValue(target);
      if (selection === $selection) {
        return obj;
      }
      if (selection.from === $selection.from && selection.to === $selection.to) {
        return obj;
      }
      changed = true;
      return {
        target: target,
        selection: $selection
      };
    });
    changed && callback && callback(_this2.takeRecords(), _this2);
  };
};

exports.default = SelectionObserver;