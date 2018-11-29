// @flow

import './czi-custom-button.css';
import PointerSurface from './PointerSurface';
import React from 'react';
import cx from 'classnames';

import type {PointerSurfaceProps} from './PointerSurface';

class CustomButton extends React.PureComponent<any, any, any> {

  props: PointerSurfaceProps & {
    icon?: string | React.Element<any> | null,
    label?: string | React.Element<any> | null,
  };

  render(): React.Element<any> {
    const {icon, label, className, title, ...pointerProps} = this.props;
    const klass = cx(className, 'czi-custom-button', {
      'use-icon': !!icon,
    });
    return (
      <PointerSurface
        {...pointerProps}
        className={klass}
        title={title || label}>
        {icon}
        {label}
      </PointerSurface>
    );
  }
}

export default CustomButton;
