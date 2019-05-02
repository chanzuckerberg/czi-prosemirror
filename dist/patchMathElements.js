'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchMathElements;

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patchMathElements(doc) {
  (0, _from2.default)(doc.querySelectorAll('img')).forEach(patchGoogleEquationElement);
}

// See https://developers.google.com/chart/image/docs/chart_params#gcharts_cht
var PARAM_CHART_CHART_TYPE = 'cht';
var PARAM_CHART_LABEL = 'chl';

// Google Doc exports math equation content as single image element that loads
// its content from google. For example:
//   <img src="https://www.google.com/chart?cht=tx&amp;c...p;chl=m%E2%88%A0C" />
// Unfortunately, such image often fails to load because its url contains the
// value that the Google Chart API does not support.
// The workaround is to use KaTex (https://katex.org/) whoch supports a broader
// set of characters that can be safely converted into math quations.

function patchGoogleEquationElement(el) {
  var ownerDocument = el.ownerDocument,
      parentElement = el.parentElement;

  if (!ownerDocument || !parentElement) {
    return;
  }
  var src = el.getAttribute('src');
  var content = getGoogleEquationContent(src);
  if (!content) {
    return;
  }

  // Replace `<img src="..." />` with `<math data-latex="..." />`.
  // Note that this requires the schema to support `MathNodeSpec`.
  var math = ownerDocument.createElement('math');
  math.setAttribute('data-latex', content);
  parentElement.insertBefore(math, el);
  parentElement.removeChild(el);
}

function getGoogleEquationContent(src) {
  if (!src) {
    return null;
  }

  var _url$parse = _url2.default.parse(src),
      host = _url$parse.host,
      pathname = _url$parse.pathname,
      query = _url$parse.query;

  if (host !== 'www.google.com' || pathname !== '/chart') {
    return null;
  }

  var params = _queryString2.default.parse(query);
  var chartType = params[PARAM_CHART_CHART_TYPE];
  var label = params[PARAM_CHART_LABEL];

  // Google exports math equation as a special chart with plan text only
  // contents.
  if (chartType !== 'tx' || !label) {
    return null;
  }

  return label;
}