// @flow

import CustomButton from './CustomButton';
import React from 'react';
import cx from 'classnames';

import './czi-custom-menu-item.css';

class CustomMenuItemSeparator extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    return (
      <div className="czi-custom-menu-item-separator"/>
    );
  }
}

class CustomMenuItem extends React.PureComponent<any, any, any> {

  static Separator = CustomMenuItemSeparator;

  props: {
    label: string,
    disabled?: ?boolean,
    onClick: (value: any, e: SyntheticEvent) => void,
    value: any,
  };

  render(): React.Element<any> {
    return (
      <CustomButton
        {...this.props}
        className="czi-custom-menu-item"
      />
    );
  }
}

export default CustomMenuItem;
