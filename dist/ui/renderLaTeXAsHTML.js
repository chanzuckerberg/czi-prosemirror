'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = renderLaTeXAsHTML;

var _canUseCSSFont = require('./canUseCSSFont');

var _canUseCSSFont2 = _interopRequireDefault(_canUseCSSFont);

var _injectStyleSheet = require('./injectStyleSheet');

var _injectStyleSheet2 = _interopRequireDefault(_injectStyleSheet);

var _katex = require('katex');

var _katex2 = _interopRequireDefault(_katex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var latexEl = document.createElement('div');

var cached = {};

var CSS_CDN_URL = '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css';
var CSS_FONT = 'KaTeX_Main';

(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var fontSupported;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _canUseCSSFont2.default)(CSS_FONT);

        case 2:
          fontSupported = _context.sent;

          if (!fontSupported) {
            console.info('Add CSS from ', CSS_CDN_URL);
            (0, _injectStyleSheet2.default)(CSS_CDN_URL);
          }

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}))();

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