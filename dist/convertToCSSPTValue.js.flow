// @flow

import {FONT_PT_SIZES} from './ui/FontSizeCommandMenuButton';

const SIZE_PATTERN = /([\d\.]+)(px|pt)/i;

export const PX_TO_PT_RATIO = 0.7518796992481203; // 1 / 1.33.
export const PT_TO_PX_RATIO = 1.33;

export default function convertToCSSPTValue(styleValue: string): number {
  const matches = styleValue.match(SIZE_PATTERN);
  if (!matches) {
    return 0;
  }
  let value = parseFloat(matches[1]);
  const unit = matches[2];
  if (!value || !unit) {
    return 0;
  }
  if (unit === 'px') {
    value = PX_TO_PT_RATIO * value;
  }
  return value;
}

export function toClosestFontPtSize(styleValue: string): number {
  const originalPTValue = convertToCSSPTValue(styleValue);

  if (FONT_PT_SIZES.includes(originalPTValue)) {
    return originalPTValue;
  }

  const largerValueIndex = FONT_PT_SIZES.findIndex(element => element > originalPTValue);
  if (largerValueIndex < 0) {
    return FONT_PT_SIZES[FONT_PT_SIZES.length - 1];
  } else if (largerValueIndex === 0) {
    return FONT_PT_SIZES[0];
  } else {
    const largerValue = FONT_PT_SIZES[largerValueIndex];
    const smallerValue = FONT_PT_SIZES[largerValueIndex - 1];
    if (largerValue - originalPTValue < originalPTValue - smallerValue) {
      return largerValue;
    } else {
      return smallerValue;
    }
  }
}
