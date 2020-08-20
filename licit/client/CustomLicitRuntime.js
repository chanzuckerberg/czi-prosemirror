// @flow

// This implements the interface of `EditorRuntime`.
import type {
    ImageLike
} from '../../src/Types';
import {
    GET,
    POST
} from '../../src/client/http';

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

    uploadImage(blob: Object): Promise < ImageLike > {
        var img: ImageLike;
        // Note: While looking at the uploadImage() function, it is found that a promise is resolved blindly after 3 seconds. Is it a
        // requirement? If not, then I think it causes two issues, 1. Even if an image upload finishes in 700ms, it will take 3s for
        // resolving the promise. 2. If the image upload takes more than 3s, then the promise will be incorrectly resolved before 
        // completing the upload.
        // The following structure may be good to solve the issue.
        return new Promise((resolve, reject) => {
            // Use uploaded image URL.
            const url = window.location.protocol + "//" + window.location.hostname + ':3004/saveimage?fn=' + blob.name;
            POST(url, blob, 'application/octet-stream').then(data => {
                img = JSON.parse(data);
                resolve(img);
            }, err => {
                img = {
                    id: '',
                    width: 0,
                    height: 0,
                    src: '',
                };
                resolve(img);
            });
        });
    }
}

export default CustomLicitRuntime;
