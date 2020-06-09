// @flow

// This implements the interface of `EditorRuntime`.

import type {ImageLike} from '../Types';
import { GET, POST } from './http';

class LicitRuntime {

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
    // [FS-AFQ][03-MAR-2020][IRAD-884#2]
    // Use uploaded image URL.
    var img: ImageLike;
    POST('/saveimage?fn='+blob.name, blob, 'application/octet-stream').then(data => {
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


export default LicitRuntime;
