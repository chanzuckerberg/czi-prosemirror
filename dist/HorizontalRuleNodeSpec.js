'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HR_DOM = ['hr'];

var HorizontalRuleNode = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM: function toDOM() {
    return HR_DOM;
  }
};

exports.default = HorizontalRuleNode;