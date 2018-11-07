// @flow

import Color from 'color';

const cache = {};

export default function toHexColor(source: any): string {
  if (!source) {
    return '';
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
