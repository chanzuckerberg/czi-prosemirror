'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderLaTeXAsHTML;

var _katex = require('katex');

var _katex2 = _interopRequireDefault(_katex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var latexEl = document.createElement('div');

var cached = {};

function renderLaTeXAsHTML(latex) {
  if (cached.hasOwnProperty(latex)) {
    return cached[latex];
  }

  var latexText = latex || '';
  latexEl.innerHTML = '';
  if (!latexText) {
    return latexText;
  }
  try {
    _katex2.default.render(latex, latexEl);
  } catch (ex) {
    console.warn(ex.message, latex);
    latexEl.innerHTML = '';
    latexEl.appendChild(document.createTextNode(latexText));
  }
  var html = latexEl.innerHTML;
  latexEl.innerHTML = '';
  cached[latex] = html;
  return html;
}