// @flow

import type {ImageLike} from '../Types';

export default class EnableImageUploadRuntime {
  // Image Upload
  canUploadImage(): boolean {
    return true;
  }

  uploadImage(file: File): Promise<ImageLike> {
    return new Promise((resolve, reject) => {
      const {FileReader} = window;
      if (FileReader) {
        const reader = new FileReader();
        reader.onload = event => {
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