// @flow

import {EditorView} from 'prosemirror-view';
import React from 'react';

import CustomButton from './CustomButton';

import './czi-link-tooltip.css';

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
    if (href && href.indexOf('#') === 0) {
      const id = href.substr(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView(true);
        return;
      }
    }
    window.open(href);
  };
}

export default LinkTooltip;
