// @flow

// This implements the interface of `EditorRuntime`.

class DemoAppRuntime {

  canProxyImageSrc(): boolean {
    return true;
  }

  getProxyImageSrc(src: string): string {
    // This simulate a fake proxy.
    return src + '#proxied=' + Date.now();
  }
}


export default DemoAppRuntime;
