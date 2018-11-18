// @flow

export default function isOffline(): boolean {
  if (window.navigator.hasOwnProperty('onLine')) {
    return !window.navigator.onLine;
  }
  return false;
}
