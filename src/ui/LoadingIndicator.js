// @flow

import './czi-loading-indicator.css';
import * as React from 'react';

// https://loading.io/css/
class LoadingIndicator extends React.PureComponent<any, any>{
  render(): React.Element<any> {
    return (
      <div className="czi-loading-indicator">
        <div className="frag czi-loading-indicator-frag-1" />
        <div className="frag czi-loading-indicator-frag-2" />
        <div className="frag czi-loading-indicator-frag-3" />
        <div className="frag czi-loading-indicator-frag-4" />
      </div>
    );
  }
}

export default LoadingIndicator;
