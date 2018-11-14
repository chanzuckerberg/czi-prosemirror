// @flow

import './czi-link-tooltip.css';
import LinkURLEditor from './LinkURLEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import createPopUp from './createPopUp';
import uuid from 'uuid/v1';
import {EditorView} from "prosemirror-view";
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
              value={href}
              target="new"
              label={href}
              title={href}
              onClick={this._openLink}
            />
            <CustomButton
              label="Change"
              value={editorView}
              onClick={onEdit}
            />
            <CustomButton
              label="Remove"
              value={editorView}
              onClick={onRemove}
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
