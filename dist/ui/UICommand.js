'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter'
};

var UICommand = function UICommand() {
  var _this = this;

  (0, _classCallCheck3.default)(this, UICommand);

  this.shouldRespondToUIEvent = function (e) {
    return e.type === UICommand.EventType.CLICK;
  };

  this.renderLabel = function (state) {
    return null;
  };

  this.isActive = function (state) {
    return false;
  };

  this.isEnabled = function (state, view) {
    return _this.execute(state, null, view);
  };

  this.execute = function (state, dispatch, view, event) {
    _this.waitForUserInput(state, dispatch, view, event).then(function (inputs) {
      _this.executeWithUserInput(state, dispatch, view, inputs);
    }).catch(function (error) {
      console.error(error);
    });
    return false;
  };

  this.waitForUserInput = function (state, dispatch, view, event) {
    return _promise2.default.resolve(undefined);
  };

  this.executeWithUserInput = function (state, dispatch, view, inputs) {
    return false;
  };
};

UICommand.EventType = EventType;
exports.default = UICommand;