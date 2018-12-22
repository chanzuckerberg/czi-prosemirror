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

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17
var SetDocAttrStep = function (_Step) {
  (0, _inherits3.default)(SetDocAttrStep, _Step);

  function SetDocAttrStep(key, value) {
    var stepType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'SetDocAttr';
    (0, _classCallCheck3.default)(this, SetDocAttrStep);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SetDocAttrStep.__proto__ || (0, _getPrototypeOf2.default)(SetDocAttrStep)).call(this));

    _this.stepType = stepType;
    _this.key = key;
    _this.value = value;
    return _this;
  }

  (0, _createClass3.default)(SetDocAttrStep, [{
    key: 'apply',
    value: function apply(doc) {
      this.prevValue = doc.attrs[this.key];
      doc.attrs[this.key] = this.value;
      return _prosemirrorTransform.StepResult.ok(doc);
    }
  }, {
    key: 'invert',
    value: function invert() {
      return new SetDocAttrStep(this.key, this.prevValue, 'revertSetDocAttr');
    }
  }, {
    key: 'map',
    value: function map() {
      return null;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        stepType: this.stepType,
        key: this.key,
        value: this.value
      };
    }
  }], [{
    key: 'fromJSON',
    value: function fromJSON(json) {
      return new SetDocAttrStep(json.key, json.value, json.stepType);
    }
  }]);
  return SetDocAttrStep;
}(_prosemirrorTransform.Step);

exports.default = SetDocAttrStep;