// @flow

import convertToCSSPTValue from './convertToCSSPTValue';

export const LAYOUT = {
  DESKTOP_SCREEN_4_3: 'desktop_screen_4_3',
  DESKTOP_SCREEN_16_9: 'desktop_screen_16_9',
  US_LETTER_LANDSCAPE: 'us_letter_landscape',
  US_LETTER_PORTRAIT: 'us_letter_portrait',
};

export const ATTRIBUTE_LAYOUT = 'data-layout';

export function getAttrs(el: HTMLElement): Object {
  const attrs: Object = {
    layout: null,
    width: null,
    padding: null,
  };

  const {width, maxWidth, padding} = (el.style || {});
  const ww = convertToCSSPTValue(width) || convertToCSSPTValue(maxWidth);
  const pp = convertToCSSPTValue(padding);
  if (ww) {
    attrs.width = ww + (pp * 2);
  }

  if (pp) {
    attrs.padding = pp;
  }

  return attrs;
}

const DocNodeSpec = {
  attrs: {
    layout: {default: null},
    padding: {default: null},
    width: {default: null},
  },
  content: 'block+',
};

export default DocNodeSpec;
