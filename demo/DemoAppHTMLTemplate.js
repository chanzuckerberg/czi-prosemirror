// @flow

import React from 'react';

class DemoAppHTMLTemplate extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    const {id} = this.props;
    return (
      <div id={id + 'template'} className="demo-app-template">
        <h1>Editor Example</h1>
        <h2>H2 Header</h2>
        <p>paragraph</p>
        <ol>
          <li>Item A</li>
          <li>Item B</li>
          <li>Item C</li>
        </ol>
        <h3>H3 Header</h3>
        <ol>
          <li>Item A</li>
          <li>Item B</li>
          <li>Item C</li>
          <ul>
            <li>Child Item A</li>
            <li>Child Item B</li>
            <li>Child Item C</li>
          </ul>
          <li>Item D</li>
          <li>Item E</li>
          <li>Item F</li>
        </ol>
      </div>
    )
  }
}

export default DemoAppHTMLTemplate;
