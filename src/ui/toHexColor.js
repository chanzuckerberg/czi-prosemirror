// @flow

import Color from 'color';

const ColorMaping = {
  'transparent': '',
  'inherit': '',
};

export default function toHexColor(source: any): string {
  if (!source) {
    return '';
  }
  if (source in ColorMaping) {
    return ColorMaping[source];
  }
  let hex = '';
  try {
    hex = Color(source).hex().toLowerCase();
    ColorMaping[source] = hex;
  } catch (ex) {
    console.warn('unable to convert to hex', source);
    ColorMaping[source] = '';
  }
  return hex;
}
