'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hyphenize;
function hadnleMatch(matched) {
  return matched[0] + '-' + matched[1].toLowerCase();
}

var cached = {};

// converts `fooBar` to `foo-bar`.
function hyphenize(str) {
  if (cached.hasOwnProperty(str)) {
    return cached[str];
  }
  var result = str.replace(/[a-z][A-Z]/g, hadnleMatch);
  cached[str] = result;
  return result;
}