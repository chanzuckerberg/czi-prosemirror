// @flow

const cached = {};

export default function canUseCSSFont(fontName: string): Promise<boolean> {
  const doc:any = document;

  if (cached.hasOwnProperty(fontName)) {
    return Promise.resolve(cached[fontName]);
  }

  if (!doc.fonts || !doc.fonts.check) {
    // Feature is not supported, install the CSS anyway
    // https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check#Browser_compatibility
    // TODO: Resolve this with `element.computedStyle`
    return Promise.resolve(false);
  }

  return new Promise(resolve => {
    const check = () => {
      if (document.readyState !== 'complete') {
        setTimeout(check, 250);
        return;
      }
      const result = doc.fonts.check(`12px ${fontName}`);
      cached[fontName] = result;
      resolve(result);
    };
    check();
  });
}
