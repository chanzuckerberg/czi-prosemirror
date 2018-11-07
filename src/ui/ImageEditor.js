// @flow

import CustomButton from './CustomButton';
import React from 'react';
import clamp from './clamp';
import cx from 'classnames';
import uuid from 'uuid/v1';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {TABLE_INSERT_TABLE} from '../configs';
import {Transform} from 'prosemirror-transform';
import {fromHTMlElement} from './rects';

import './czi-prose-mirror.css';
import './czi-form.css';
import './czi-image-editor.css';

export type ImageEditorValue = {
  height: ?number,
  src: ?string,
  width: ?number,
};

class ImageEditor extends React.PureComponent<any, any, any> {

  _img = null;
  _unmounted = false;
  _id = uuid();

  props: {
    initialValue: ?ImageEditorValue,
    close: (val: ?ImageEditorValue) => void,
  };

  state = {
    ...(this.props.initialValue || {}),
    validHeight: null,
    validSrc: null,
    validWidth: null,
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.Element<any> {
    const {src, validSrc} = this.state;
    return (
      <div className="czi-image-editor">
        <form className="czi-form">
          <fieldset>
            <legend>Insert Image</legend>
            <input
              value={src || ''}
              type="text" placeholder="Paste URL of Image..."
              onChange={this._onSrcChange}
            />
            <em>
              Only select image that you have confirmed the license to use
            </em>
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
            <CustomButton
              disabled={!validSrc}
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
        <div id={this._id} />
      </div>
    );
  }

  _onSrcChange = (e: SyntheticInputEvent) => {
    const src = e.target.value;
    this.setState({
      src,
      validHeight: null,
      validSrc: null,
      validWidth: null,
    }, this._didSrcChange);
  };

  _didSrcChange = (): void => {
    const img = document.createElement('image');
    this._img = img;
  };

  _cancel = (): void => {
    this.props.close();
  };

  _insert = (): void => {
    this.props.close(this.state);
  };
}

export default ImageEditor;
