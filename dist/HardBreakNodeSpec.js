'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BR_DOM = ['br'];

var HardBreakNodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM: function toDOM() {
    return BR_DOM;
  }
};

exports.default = HardBreakNodeSpec;