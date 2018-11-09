// @flow

import Color from 'color';

const cache = {
  'transparent': '',
};

export default function toHexColor(source: any): string {
  if (!source) {
    return '';
  }
  if (source in cache) {
    return cache[source];
  }
  let hex = '';
  try {
    hex = Color(source).hex().toLowerCase();
    cache[source] = hex;
  } catch (ex) {
    console.error(`unable to convert ${source} to hex`);
    cache[source] = '';
  }
  return hex;
}
