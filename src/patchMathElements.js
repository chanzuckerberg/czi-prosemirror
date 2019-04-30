// @flow

import queryString from 'query-string';
import url from 'url';
export default function patchMathElements(doc: Document): void {
  Array.from(doc.querySelectorAll('img')).forEach(patchGoogleEquationElement);
}

// See https://developers.google.com/chart/image/docs/chart_params#gcharts_cht
const PARAM_CHART_CHART_TYPE = 'cht';
const PARAM_CHART_LABEL = 'chl';

// Google Doc exports math equation content as single image element that loads
// its content from google. For example:
//   <img src="https://www.google.com/chart?cht=tx&amp;c...p;chl=m%E2%88%A0C" />
// Unfortunately, such image often fails to load because its url contains the
// value that the Google Chart API does not support.
// The workaround is to use KaTex (https://katex.org/) whoch supports a broader
// set of characters that can be safely converted into math quations.

function patchGoogleEquationElement(el: HTMLElement): void {
  const {ownerDocument, parentElement} = el;
  if (!ownerDocument || !parentElement) {
    return;
  }
  const src = el.getAttribute('src');
  const content = getGoogleEquationContent(src);
  if (!content) {
    return;
  }

  // Replace `<img src="..." />` with `<math data-latex="..." />`.
  // Note that this requires the schema to support `MathNodeSpec`.
  const math = ownerDocument.createElement('math');
  math.setAttribute('data-latex', content);
  parentElement.insertBefore(math, el);
  parentElement.removeChild(el);
}

function getGoogleEquationContent(src: ?string): ?string {
  if (!src) {
    return null;
  }
  const {host, pathname, query} = url.parse(src);
  if (host !== 'www.google.com' || pathname !== '/chart') {
    return null;
  }

  const params = queryString.parse(query);
  const chartType = params[PARAM_CHART_CHART_TYPE];
  const label = params[PARAM_CHART_LABEL];

  // Google exports math equation as a special chart with plan text only
  // contents.
  if (chartType !== 'tx' || !label) {
    return null;
  }

  return label;
}
