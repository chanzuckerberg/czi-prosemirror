// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import Licit from '../../src/client/Licit';

function main(): void {
  const el = document.createElement('div');
  el.id = 'demo-app';
  el.style = "width: 100vw; height: 100vh;"
  const {body} = document;
  body && body.appendChild(el);
  // [FS] IRAD-982 2020-06-10
  // Use the licit component for demo.  
  ReactDOM.render(<Licit docID={1} collaborative={true} debug={false}/>, el);
}

window.onload = main;
