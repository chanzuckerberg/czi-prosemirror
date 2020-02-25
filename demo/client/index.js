// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import DemoApp from './DemoApp';

function main(): void {
  const el = document.createElement('div');
  el.id = 'demo-app';
  const {body} = document;
  body && body.appendChild(el);
  ReactDOM.render(<DemoApp />, el);
}

window.onload = main;
