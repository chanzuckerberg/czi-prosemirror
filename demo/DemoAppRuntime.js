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
    if (src.indexOf('data:') === 0) {
      return src;
    }
    const suffix = 'proxied=1';
    return src.indexOf('?') === -1 ? `${src}?${suffix}` : `${src}&${suffix}`;
  }

  // Image Upload
  canUploadImage(): boolean {
    return true;
  }

  uploadImage(file: File): Promise<ImageLike> {
    return new Promise((resolve, reject) => {
      const {FileReader} = window;
      if (FileReader) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // base64 encoded url.
          const src = event.target.result;
          resolve({src, height: 0, width: 0, id: ''});
        };
        reader.onerror = () => {
          reject(new Error('FileReader failed'));
        };
        reader.readAsDataURL(file);
      } else {
        reject(new Error('FileReader is not available'));
      }
    });
  }
}


export default DemoAppRuntime;
