// @flow

import React from 'react';

class Frag extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    return (
      <div className="czi-frag">
        {this.props.children}
      </div>
    );
  }
}

export default Frag;