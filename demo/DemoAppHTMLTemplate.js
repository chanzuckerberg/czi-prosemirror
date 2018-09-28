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
      </div>
    )
  }
}

export default DemoAppHTMLTemplate;
