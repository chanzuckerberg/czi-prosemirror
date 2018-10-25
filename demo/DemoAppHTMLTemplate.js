// @flow

import React from 'react';

class DemoAppHTMLTemplate extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    const {id} = this.props;
    return (
      <div id={id + 'template'} className="demo-app-template">
        <h3>H3 Header</h3>
        <ol>
          <li>AAAAA</li>
          <li>BBB</li>
          <li>CCCCC</li>
        </ol>
        <h1>Editor Example</h1>
        <h2>H2 Header</h2>
        <p>
          Lorem ipsum dolor sit amet, phaedrum efficiantur pri cu, te quem
          aliquando est. Viris aliquando definiebas duo et. Usu everti iriure
        </p>
        <p>
          posidonium in. Te mea nonumes detracto legendos. Nulla essent causae
          et per, in cibo sententiae est. Sit tamquam petentium an. Quo id p
          ersecuti dissentias, cu sed diam prompta meliore, ne nominavi conv
          enire principes pro.
        </p>
        <ul start="10">
          <li>KKK</li>
          <li>GGG</li>
          <li>PPP</li>
        </ul>
        <ol start="10">
          <li>Item A</li>
          <li>Item B</li>
          <li>Item C</li>
        </ol>
      </div>
    )
  }
}

export default DemoAppHTMLTemplate;
