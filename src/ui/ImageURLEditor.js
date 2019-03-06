// @flow

import React from 'react';

import CustomButton from './CustomButton';
import preventEventDefault from './preventEventDefault';
import resolveImage from './resolveImage';

import './czi-form.css';
import './czi-image-url-editor.css';

import type {ImageLike} from '../Types';

class ImageURLEditor extends React.PureComponent<any, any, any> {

  _img = null;
  _unmounted = false;

  props: {
    initialValue: ?ImageLike,
    close: (val: ?ImageLike) => void,
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
        className="czi-image-url-editor-input-preview"
        style={{backgroundImage: `url(${String(validValue.src)}`}}
      /> :
      null;

    return (
      <div className="czi-image-url-editor">
        <form className="czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>Insert Image</legend>
            <div className="czi-image-url-editor-src-input-row">
              <input
                autoFocus={true}
                className="czi-image-url-editor-src-input"
                onChange={this._onSrcChange}
                placeholder="Paste URL of Image..." type="text"
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

export default ImageURLEditor;
