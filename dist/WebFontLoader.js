'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebFontLoader = function () {
  function WebFontLoader() {
    (0, _classCallCheck3.default)(this, WebFontLoader);
    this._implementation = null;
  }

  (0, _createClass3.default)(WebFontLoader, [{
    key: 'setImplementation',
    value: function setImplementation(impl) {
      this._implementation = impl;
    }
  }, {
    key: 'load',
    value: function load(params) {
      var impl = this._implementation;
      if (impl) {
        impl.load(params);
      } else {
        console.warn('Method WebFontLoader.load does not have an implementation');
      }
    }
  }]);
  return WebFontLoader;
}();

;

var loader = new WebFontLoader();

exports.default = loader;