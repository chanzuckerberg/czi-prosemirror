// @flow

import {format, parse} from 'url';

type Method = 'get' | 'post';
type IdStrict = number;

type Payload = {
  docId: IdStrict,
  version: number,
  clientID?: ?number,
  steps?: ?Array<Object>,
};

const PATH_PREFIX = '/docs';
const DEMO_SERVER_PORT = '3001';
const DOC_SERVER_PORT = '3002';

export default function requestDocServer(
  method: Method,
  payload: Payload,
): Promise<Object> {
  return new Promise((resolve, reject) => {
    const parsed: Object = parse(window.location.href, true);
    const {docId} = payload;
    let postData = null;
    parsed.pathname = `${PATH_PREFIX}/${String(docId)}/` + method.toLowerCase();

    if (method === 'post') {
      const params: Object = {debug: 1};
      parsed.query && Object.assign(params, parsed.query);
      Object.assign(params, payload);
      parsed.query = null;
      postData = {params};
    } else if(parsed.query) {
      parsed.query.debug = 1;
      Object.assign(parsed.query, payload);
    }

    const url = format(parsed).replace(DEMO_SERVER_PORT, DOC_SERVER_PORT);

    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (!xhr) {
        return;
      }
      let result = null;
      try {
        result = JSON.parse(xhr.responseText);
      } catch (ex) {
        // pass
      }
      if (!result) {
        reject(new Error('invalid JSON'));
        return;
      }
      resolve(result);
      xhr = null;
    });

    xhr.addEventListener('error', () => {
      if (!xhr) {
        return;
      }
      reject(new Error(`makeRequest Error: unable to ${method} ${url}`));
      alert('Did you run \n`node demo/server/runDocServer.js`?');
      xhr = null;
    });

    xhr.open(method, url, true);
    if (postData) {
      const jsonStr = window.encodeURIComponent(JSON.stringify(postData));
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(`params=${jsonStr}`);
    } else {
      xhr.send();
    }
  });
}
