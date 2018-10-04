// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import './playground.css';

class Playground extends React.Component<any, any, any> {
  render() {
    return (
      <div className="playground">
        Hello!!
      </div>
    );
  }
}

function main(): void {
  const el = document.createElement('div');
  el.id = 'playground';
  const {body} = document;
  body && body.appendChild(el);
  ReactDOM.render(<Playground />, el);
}

window.onload = main;
