// @flow

// This implements the interface of `EditorRuntime`.

import type {ImageLike} from '../src/Types';

class DemoAppRuntime {

  // Image Proxy
  canProxyImageSrc(): boolean {
    return true;
  }

  getProxyImageSrc(src: string): string {
    // This simulate a fake proxy.
    return src + '#proxied=' + Date.now();
  }

  // Image Upload
  canUploadImage(): boolean {
    return true;
  }

  uploadImage(blob: Object): Promise<ImageLike> {
    const img: ImageLike = {
      id: '',
      width: 200,
      height: 300,
      src: 'https://placekitten.com/200/300',
    };
    return Promise.resolve(img);
  }
}


export default DemoAppRuntime;
