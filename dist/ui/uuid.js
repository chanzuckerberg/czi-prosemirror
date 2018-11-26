'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function uuid() {
  return (0, _v2.default)();
}