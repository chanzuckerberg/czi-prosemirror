// @flow

import url from 'url';

import isOffline from './isOffline';

export type ImageResult = {
  complete: boolean,
  height: number,
  naturalHeight: number,
  naturalWidth: number,
  src: string,
  width: number,
};

const cache = {};
const queue = [];

export default function resolveImage(src: ?string): Promise<ImageResult> {
  return new Promise((resolve, reject) => {
    const bag = {src, resolve, reject};
    queue.push(bag);
    processQueue();
  });
}

function processQueue() {
  const bag = queue.shift();
  if (bag) {
    processPromise(bag.src, bag.resolve, bag.reject);
  }
}

function processPromise(
  src: ?string,
  resolve: Function,
  reject: Function
): void {
  const result: ImageResult = {
    complete: false,
    height: 0,
    naturalHeight: 0,
    naturalWidth: 0,
    src: src || '',
    width: 0,
  };

  if (isOffline()) {
    resolve(result);
    return;
  }

  const srcStr = src || '';
  if (!srcStr) {
    resolve(result);
    return;
  } else if (cache[srcStr]) {
    const cachedResult = Object.assign({}, cache[srcStr]);
    resolve(cachedResult);
    return;
  }

  const parsedURL = url.parse(srcStr);
  const {protocol, port} = parsedURL;
  if (
    !/(http:|https:|data:)/.test(protocol || window.location.protocol) ||
    port
  ) {
    resolve(result);
    return;
  }

  let img;

  const onLoad = () => {
    if (img) {
      result.width = img.width;
      result.height = img.height;
      result.naturalWidth = img.width;
      result.naturalHeight = img.height;
      result.complete = true;
    }
    resolve(result);
    dispose();
    cache[srcStr] = {...result};
  };

  const onError = () => {
    resolve(result);
    dispose();
  };

  const dispose = () => {
    if (img) {
      if (img instanceof HTMLElement) {
        const pe = img.parentNode;
        pe && pe.removeChild(img);
      }
      img.onload = null;
      img.onerror = null;
      img = null;
    }
    processQueue();
  };

  const {body} = document;
  if (body) {
    img = document.createElement('img');
    img.style.cssText =
      'position:fixed;left:-10000000000px;width:auto;height:auto;';
    img.onload = onLoad;
    img.onerror = onError;
    img.src = srcStr;
    body.appendChild(img);
  } else {
    img = new Image();
    img.onload = onLoad;
    img.onerror = onError;
    img.src = srcStr;
  }
}
