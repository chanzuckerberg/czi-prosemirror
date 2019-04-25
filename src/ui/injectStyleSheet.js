// @flow

import url from 'url';

const addedElements = new Map();

function createElement(tag: string, attrs: Object): Element {
  const el: any = document.createElement(tag);
  Object.keys(attrs).forEach(key => {
    if (key === 'className') {
      el[key] = attrs[key];
    } else {
      el.setAttribute(key, attrs[key]);
    }
  });
  return el;
}

export default function injectStyleSheet(urlStr: string): void {
  const parsedURL = url.parse(urlStr);
  const {protocol} = parsedURL;
  const protocolPattern = /^(http:|https:)/;
  if (!protocolPattern.test(protocol || '')) {
    if (protocolPattern.test(window.location.protocol)) {
      parsedURL.protocol = window.location.protocol;
    } else {
      parsedURL.protocol = 'http:';
    }
  }
  const href = url.format(parsedURL);
  if (addedElements.has(href)) {
    return;
  }
  const el = createElement('link', {
    crossorigin: 'anonymous',
    href,
    rel: 'stylesheet',
  });
  addedElements.set(href, el);
  const root = document.head || document.documentElement || document.body;
  root && root.appendChild(el);
}
