
// [FS-SEA][24-02-2020]
// overrided the method form 'convertToCSSPTValue.js' file to avoid the compiling issue .
// [FS-AG][28-02-2020]
// IRAD-893 - Copy Paste From External Source Not Working
// removed {} from import, because convertToCSSPTValue is a default export function.
import convertToCSSPTValue from './convertToCSSPTValue';

export function toClosestFontPtSize(styleValue: string): number {
    // duplicated FONT_PT_SIZES(available in ./ui/FontSizeCommandMenuButton)
    const FONT_PT_SIZES = [
        8,
        9,
        10,
        11,
        12,
        14,
        18,
        24,
        30,
        36,
        48,
        60,
        72,
        90,
      ];
    const originalPTValue = convertToCSSPTValue(styleValue);
  
    if (FONT_PT_SIZES.includes(originalPTValue)) {
      return originalPTValue;
    }
  
    return FONT_PT_SIZES.reduce((prev, curr) => {
      return Math.abs(curr - originalPTValue) < Math.abs(prev - originalPTValue)
        ? curr
        : prev;
    }, Number.NEGATIVE_INFINITY);
  }