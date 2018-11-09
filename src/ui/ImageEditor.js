// @flow

import CustomButton from './CustomButton';
import React from 'react';
import clamp from './clamp';
import cx from 'classnames';
import resolveImage from './resolveImage';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {TABLE_INSERT_TABLE} from '../configs';
import {Transform} from 'prosemirror-transform';
import {fromHTMlElement} from './rects';

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

  props: {
    initialValue: ?ImageEditorValue,
    close: (val: ?ImageEditorValue) => void,
  };

  state = {
    ...(this.props.initialValue || {}),
    validValue: null,
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.Element<any> {
    const {src, validValue} = this.state;
    const preview = validValue ?
      <div
        className="czi-image-editor-input-preview"
        style={{backgroundImage: `url(${String(validValue.src)}`}}
      /> :
      null;

    return (
      <div className="czi-image-editor">
        <form className="czi-form">
          <fieldset>
            <legend>Insert Image</legend>
            <div className="czi-image-editor-src-input-row">
              <input
                className="czi-image-editor-src-input"
                onChange={this._onSrcChange}
                type="text" placeholder="Paste URL of Image..."
                value={src || ''}
              />
              {preview}
            </div>
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
              active={!!validValue}
              disabled={!validValue}
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
      </div>
    );
  }

  _onSrcChange = (e: SyntheticInputEvent) => {
    const src = e.target.value;
    this.setState({
      src,
      validValue: null,
    }, this._didSrcChange);
  };

  _didSrcChange = (): void => {
    resolveImage(this.state.src).then(result => {
      if (this.state.src === result.src && !this._unmounted) {
        const validValue = result.complete ?
          result :
          null;
        this.setState({validValue});
      }
    });
  };

  _cancel = (): void => {
    this.props.close();
  };

  _insert = (): void => {
    const {validValue} = this.state;
    this.props.close(validValue);
  };
}

export default ImageEditor;
