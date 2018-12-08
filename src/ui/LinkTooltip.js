// @flow

import './czi-link-tooltip.css';
import React from 'react';
import {EditorView} from 'prosemirror-view';
import CustomButton from './CustomButton';

class LinkTooltip extends React.PureComponent<any, any, any> {

  props: {
    editorView: EditorView,
    href: string,
    onEdit: (view: EditorView) => void,
    onRemove: (view: EditorView) => void,
  };


  render(): React.Element<any> {
    const {href, editorView, onEdit, onRemove} = this.props;
    return (
      <div className="czi-link-tooltip">
        <div className="czi-link-tooltip-body">
          <div className="czi-link-tooltip-row">
            <CustomButton
              className="czi-link-tooltip-href"
              label={href}
              onClick={this._openLink}
              target="new"
              title={href}
              value={href}
            />
            <CustomButton
              label="Change"
              onClick={onEdit}
              value={editorView}
            />
            <CustomButton
              label="Remove"
              onClick={onRemove}
              value={editorView}
            />
          </div>
        </div>
      </div>
    );
  }

  _openLink = (href: string): void => {
    window.open(href);
  };
}

export default LinkTooltip;
