// @flow

// This implements the interface of `EditorRuntime`.

import type {ImageLike} from '../../src/Types';

class DemoAppRuntime {

  // Image Proxy
  canProxyImageSrc(): boolean {
    return true;
  }

  getProxyImageSrc(src: string): string {
    // This simulate a fake proxy.
    const suffix = 'proxied=1';
    return src.indexOf('?') === -1 ? `${src}?${suffix}` : `${src}&${suffix}`
  }

  // Image Upload
  canUploadImage(): boolean {
    return true;
  }

  uploadImage(blob: Object): Promise<ImageLike> {
    // This simulate a fake upload.
    const img: ImageLike = {
      id: '',
      width: 100,
      height: 100,
      src: 'https://placekitten.com/100/100',
    };
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(img);
      }, 3000);
    });
  }
}


export default DemoAppRuntime;
