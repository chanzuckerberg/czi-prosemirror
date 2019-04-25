// @flow

class WebFontLoader {
  _implementation = null;

  setImplementation(impl: any): void {
    this._implementation = impl;
  }

  load(params: Object): void {
    const impl = this._implementation;
    if (impl) {
      impl.load(params);
    } else {
      console.warn('Method WebFontLoader.load does not have an implementation');
    }
  }
}

const loader = new WebFontLoader();

export default loader;
