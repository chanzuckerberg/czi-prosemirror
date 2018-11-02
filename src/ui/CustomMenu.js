// @flow

import React from 'react';
import cx from 'classnames';

import './czi-custom-menu.css';

class CustomMenu extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    const {children} = this.props;
    return (
      <div className="czi-custom-menu">
        {children}
      </div>
    );
  }
}

export default CustomMenu;
