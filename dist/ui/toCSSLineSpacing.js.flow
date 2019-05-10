// @flow

export const SINGLE_LINE_SPACING = '125%';
export const DOUBLE_LINE_SPACING = '200%';

// In Google Doc, "single line height" is exported as style
// "line-height: 1.15" which is too narrow to read.
// This defines the deprecate line spacing values that should me migrated.
const DEPRECATED_SINGLE_LINE_SPACING_VALUES = new Set(['115%', '100%']);

const NUMBER_VALUE_PATTERN = /^\d+(.\d+)?$/;

// Normalize the css line-height vlaue to percentage-based value if applicable.
// e.g. This converts "1.5" to "150%".
export default function toCSSLineSpacing(source: any): string {
  if (!source) {
    return '';
  }

  let strValue = String(source);

  // e.g. line-height: 1.5;
  if (NUMBER_VALUE_PATTERN.test(strValue)) {
    const numValue = parseFloat(strValue);
    strValue = String(Math.round(numValue * 100)) + '%';
  }

  if (DEPRECATED_SINGLE_LINE_SPACING_VALUES.has(strValue)) {
    return SINGLE_LINE_SPACING;
  }

  // e.g. line-height: 15px;
  return strValue;
}
