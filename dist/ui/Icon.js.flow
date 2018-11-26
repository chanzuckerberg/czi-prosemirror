// @flow

import './czi-icon.css'
import React from 'react';
import cx from 'classnames';

const VALID_CHARS = /[a-z_]+/;

class Icon extends React.PureComponent<any, any, any> {

  props: {
    type: string,
    title: ?string,
  };

  render(): React.Element<any> {
    const {type, title} = this.props;
    let className = '';
    let children = '';
    if (!type || !VALID_CHARS.test(type)) {
      className = cx('czi-icon-unknown');
      children = title || type;
    } else {
      className = cx('czi-icon', {[type]: true});
      children = type;
    }
    return (
      <span className={className}>
        {children}
      </span>
    );
  }
}

export default Icon;
