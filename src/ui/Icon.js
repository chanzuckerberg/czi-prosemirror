// @flow

import cx from 'classnames';
import React from 'react';

import canUseCSSFont from './canUseCSSFont';
import injectStyleSheet from './injectStyleSheet';

import './czi-icon.css';

const VALID_CHARS = /[a-z_]+/;
const cached = {};

const CSS_CDN_URL = '//fonts.googleapis.com/icon?family=Material+Icons';
const CSS_FONT = 'Material Icons';

(async function() {
  // Inject CSS Fonts reuqired for toolbar icons.
  const fontSupported = await canUseCSSFont(CSS_FONT);
  if (!fontSupported) {
    console.info('Add CSS from ', CSS_CDN_URL);
    injectStyleSheet(CSS_CDN_URL);
  }
})();


class Icon extends React.PureComponent<any, any, any> {

  // Get the static Icon.
  static get(type: string, title: ?string):  React.Element<any> {
    const key = `${type || ''}-${title || ''}`;
    const icon = cached[key] || <Icon title={title} type={type} />;
    cached[key] = icon;
    return icon;
  }

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
