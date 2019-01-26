// @flow

import {EditorView} from 'prosemirror-view';
import React from 'react';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';

import CustomButton from './CustomButton';

import './czi-link-tooltip.css';

class LinkTooltip extends React.PureComponent<any, any, any> {

  props: {
    editorView: EditorView,
    href: string,
    onCancel: (view: EditorView) => void,
    onEdit: (view: EditorView) => void,
    onRemove: (view: EditorView) => void,
  };

  _unmounted = false;

  state = {
    hidden: false,
  };

  render(): ?React.Element<any> {
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
        const {onCancel, editorView} = this.props;
        onCancel(editorView);
        (async () => {
          // https://www.npmjs.com/package/smooth-scroll-into-view-if-needed
          await scrollIntoView(el, {
            scrollMode: 'if-needed',
            // block: 'nearest',
            // inline: 'nearest',
            behavior: 'smooth',
          });
        })();
      }
      return;
    }
    window.open(href);
  };
}

export default LinkTooltip;
