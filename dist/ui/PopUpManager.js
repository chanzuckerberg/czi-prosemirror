'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rects = require('./rects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_Rect = require('./rects').babelPluginFlowReactPropTypes_proptype_Rect || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_PositionHandler = require('./PopUpPosition').babelPluginFlowReactPropTypes_proptype_PositionHandler || require('prop-types').any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_PopUpDetails', {
  value: require('prop-types').shape({
    anchor: require('prop-types').any,
    anchorRect: babelPluginFlowReactPropTypes_proptype_Rect,
    autoDismiss: require('prop-types').bool.isRequired,
    body: require('prop-types').any,
    bodyRect: babelPluginFlowReactPropTypes_proptype_Rect,
    close: require('prop-types').func.isRequired,
    modal: require('prop-types').bool.isRequired,
    position: babelPluginFlowReactPropTypes_proptype_PositionHandler
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_PopUpBridge', {
  value: require('prop-types').shape({
    getDetails: require('prop-types').func.isRequired
  })
});


var CLICK_INTERVAL = 350;
var DUMMY_RECT = { x: -10000, y: -10000, w: 0, h: 0 };

var PopUpManager = function () {
  function PopUpManager() {
    var _this = this;

    (0, _classCallCheck3.default)(this, PopUpManager);
    this._bridges = new _map2.default();
    this._transforms = new _map2.default();
    this._mx = 0;
    this._my = 0;
    this._rafID = 0;

    this._onMouseChange = function (e) {
      _this._mx = e.clientX;
      _this._my = e.clientY;
      _this._rafID && cancelAnimationFrame(_this._rafID);
      _this._rafID = requestAnimationFrame(_this._syncPosition);
    };

    this._onClick = function (e) {
      var bridgeToDetails = new _map2.default();
      var now = Date.now();
      var detailsWithModalToDismiss = void 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(_this._bridges), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

          var bridge = _ref2[0];
          var registeredAt = _ref2[1];

          if (now - registeredAt > CLICK_INTERVAL) {
            var details = bridge.getDetails();
            if (details.modal && details.autoDismiss) {
              detailsWithModalToDismiss = details;
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!detailsWithModalToDismiss) {
        return;
      }
      var _detailsWithModalToDi = detailsWithModalToDismiss,
          body = _detailsWithModalToDi.body,
          close = _detailsWithModalToDi.close;

      var pointer = (0, _rects.fromXY)(e.clientX, e.clientY, 1);
      var bodyRect = body ? (0, _rects.fromHTMlElement)(body) : null;
      if (!bodyRect || !(0, _rects.isIntersected)(pointer, bodyRect)) {
        close();
      }
    };

    this._syncPosition = function () {
      _this._rafID = 0;

      var bags = new _map2.default();
      var bridgeToDetails = new _map2.default();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(_this._bridges), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref3 = _step2.value;

          var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

          var bridge = _ref4[0];
          var registeredAt = _ref4[1];

          var details = bridge.getDetails();
          bridgeToDetails.set(bridge, details);
          var _anchor = details.anchor,
              _body = details.body;

          if (_body instanceof HTMLElement) {
            details.bodyRect = (0, _rects.fromHTMlElement)(_body);
          }
          if (_anchor instanceof HTMLElement) {
            details.anchorRect = (0, _rects.fromHTMlElement)(_anchor);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var pointer = (0, _rects.fromXY)(_this._mx, _this._my, 2);
      var hoveredAnchors = new _set2.default();
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(bridgeToDetails), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _ref5 = _step3.value;

          var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

          var _bridge = _ref6[0];
          var details = _ref6[1];
          var _anchor2 = details.anchor,
              _bodyRect = details.bodyRect,
              _anchorRect = details.anchorRect,
              _position = details.position,
              _body2 = details.body,
              _close = details.close;

          if (!_bodyRect && !_anchorRect) {
            continue;
          }

          var _position2 = _position(_anchorRect, _bodyRect),
              x = _position2.x,
              y = _position2.y;

          var transform = 'translate(' + x + 'px, ' + y + 'px)';

          if (_body2 && _bodyRect && _this._transforms.get(_bridge) !== transform) {
            _this._transforms.set(_bridge, transform);
            _body2.style.transform = transform;
            _bodyRect.x = x;
            _bodyRect.y = y;
          }

          if ((0, _rects.isIntersected)(pointer, _bodyRect || DUMMY_RECT, 0) || (0, _rects.isIntersected)(pointer, _anchorRect || DUMMY_RECT, 0)) {
            _anchor2 && hoveredAnchors.add(_anchor2);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      while (true) {
        var size = hoveredAnchors.size;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator3.default)(bridgeToDetails), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _ref7 = _step4.value;

            var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

            var _bridge2 = _ref8[0];
            var _details = _ref8[1];
            var _anchor3 = _details.anchor,
                _body3 = _details.body;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = (0, _getIterator3.default)(hoveredAnchors), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var ha = _step5.value;

                if (_anchor3 && _body3 && !hoveredAnchors.has(_anchor3) && _body3.contains(ha)) {
                  hoveredAnchors.add(_anchor3);
                }
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        if (hoveredAnchors.size === size) {
          break;
        }
      }

      var now = Date.now();
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(_this._bridges), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _ref9 = _step6.value;

          var _ref10 = (0, _slicedToArray3.default)(_ref9, 2);

          var _bridge3 = _ref10[0];
          var _registeredAt = _ref10[1];

          var _details2 = bridgeToDetails.get(_bridge3);
          if (_details2) {
            var _autoDismiss = _details2.autoDismiss,
                _anchor4 = _details2.anchor,
                _body4 = _details2.body,
                _close2 = _details2.close,
                _modal = _details2.modal;

            if (_autoDismiss &&
            // Modal is handled separately at `onClick`
            !_modal && now - _registeredAt > CLICK_INTERVAL && !hoveredAnchors.has(_anchor4)) {
              _close2();
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    };
  }

  (0, _createClass3.default)(PopUpManager, [{
    key: 'register',
    value: function register(bridge) {
      this._bridges.set(bridge, Date.now());
      this._transforms.set(bridge, null);
      if (this._bridges.size === 1) {
        this._observe();
      }
      this._rafID = requestAnimationFrame(this._syncPosition);
    }
  }, {
    key: 'unregister',
    value: function unregister(bridge) {
      this._bridges.delete(bridge);
      this._transforms.delete(bridge);
      if (this._bridges.size === 0) {
        this._unobserve();
      }
      this._rafID && cancelAnimationFrame(this._rafID);
    }
  }, {
    key: '_observe',
    value: function _observe() {
      document.addEventListener('mousemove', this._onMouseChange, false);
      document.addEventListener('mouseup', this._onMouseChange, false);
      document.addEventListener('click', this._onClick, false);
    }
  }, {
    key: '_unobserve',
    value: function _unobserve() {
      document.removeEventListener('mousemove', this._onMouseChange, false);
      document.removeEventListener('mouseup', this._onMouseChange, false);
      document.removeEventListener('click', this._onClick, false);
      this._rafID && cancelAnimationFrame(this._rafID);
    }
  }]);
  return PopUpManager;
}();

var instance = new PopUpManager();

exports.default = instance;