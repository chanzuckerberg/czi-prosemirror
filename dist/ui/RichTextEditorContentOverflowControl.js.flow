// @flow

import './czi-rte-content-overflow-control.css';
import React from 'react';

class RichTextEditorContentOverflowControl extends React.PureComponent {
  props: {
    contentOverflowHidden: boolean,
    onToggle: (value: boolean) => void,
  };

  render(): React.Element<any> {
    const {contentOverflowHidden} = this.props;
    const icon = contentOverflowHidden ? '\u00BB' : '\u00AB';
    const text = contentOverflowHidden ? 'Read more' : 'Read less';
    return (
      <a
        className="czi-rte-content-overflow-control"
        href="#"
        onClick={this._onClick}>
        <span className="icon">{icon}</span>
        {text}
      </a>
    );
  }

  _onClick = (e: SyntheticEvent): void => {
    e.preventDefault();
    const {contentOverflowHidden, onToggle} = this.props;
    onToggle(!contentOverflowHidden);
  };
}

module.exports = RichTextEditorContentOverflowControl;
