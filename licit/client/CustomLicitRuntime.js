// @flow

// This implements the interface of `EditorRuntime`.

import type {ImageLike} from '../../src/Types';
import { GET, POST } from '../../src/client/http';

class CustomLicitRuntime {

  // Image Proxy
  canProxyImageSrc(): boolean {
    return false;
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
    // Use uploaded image URL.
    var img: ImageLike;
    const url = window.location.protocol + "//" + window.location.hostname + ':3004/saveimage?fn='+blob.name;
    POST(url, blob, 'application/octet-stream').then(data => {
      img = JSON.parse(data);
    }, err => {
      img = {
        id: '',
        width: 0,
        height: 0,
        src: '',
      }
    });

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(img);
      }, 3000);
    });    
  }
}

export default CustomLicitRuntime;
