// @flow

// This implements the interface of `EditorRuntime`.

import type {ImageLike} from '../src/Types';

function randInt(): number {
  const values = [100, 200, 300];
  return values[Math.floor(Math.random() *values.length)];
}

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

  uploadImage(blob: File): Promise<ImageLike> {
    // This simulate a fake upload.
    const ww = randInt();
    const hh = randInt();
    const img: ImageLike = {
      id: '',
      width: ww,
      height: hh,
      src: `https://placekitten.com/${ww}/${hh}`,
    };
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(img);
      }, 1000);
    });
  }
}


export default DemoAppRuntime;
