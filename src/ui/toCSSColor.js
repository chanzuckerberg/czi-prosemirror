// @flow

import Color from 'color';

const RGBA_PATTERN = /^rgba/i;
const RGBA_TRANSPARENT = 'rgba(0,0,0,0)';

const ColorMaping = {
  'transparent': RGBA_TRANSPARENT,
  'inherit': '',
};

export function isTransparent(source: any): boolean {
  if (!source) {
    return true;
  }
  const hex = toCSSColor(source);
  return !hex || hex === RGBA_TRANSPARENT;
}

export function toCSSColor(source: any): string {
  if (!source) {
    return '';
  }
  if (source in ColorMaping) {
    return ColorMaping[source];
  }

  if (source && RGBA_PATTERN.test(source)) {
    const color = Color(source);
    if (color.valpha === 0) {
      ColorMaping[source] = RGBA_TRANSPARENT;
      return RGBA_TRANSPARENT;
    }
    const rgba = color.toString();
    ColorMaping[source] = rgba.toString();
    return rgba;
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

export default toCSSColor;
