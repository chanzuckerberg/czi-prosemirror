// @flow

import './czi-link-tooltip.css';
import LinkURLEditor from './LinkURLEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import createPopUp from './createPopUp';
import uuid from 'uuid/v1';
import {EditorView} from "prosemirror-view";
import CustomButton from './CustomButton';


import type {LinkURLEditorValue} from './LinkURLEditor';

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
            <a
              className="czi-link-tooltip-href"
              href={href}
              target="new"
              title={href}>
              {href}
            </a>
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
}

export default LinkTooltip;
