// @flow

import './czi-form.css';
import './czi-image-upload-editor.css';
import CustomButton from './CustomButton';
import LoadingIndicator from './LoadingIndicator';
import React from 'react';
import clamp from './clamp';
import cx from 'classnames';
import resolveImage from './resolveImage';
import uuid from './uuid';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import type {EditorRuntime, ImageLike} from '../Types';

class ImageUploadEditor extends React.PureComponent<any, any, any> {

  _img = null;
  _unmounted = false;

  props: {
    runtime: ?EditorRuntime,
    close: (val: ?ImageLike) => void,
  };

  state = {
    error: null,
    id: uuid(),
    pending: false,
    validValue: null,
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.Element<any> {
    const {validValue, id, error, pending} = this.state;
    const className = cx('czi-image-upload-editor', {pending, error});
    let label = 'Choose a image file...';

    if (pending) {
      label = <LoadingIndicator />;
    } else if (error) {
      label = 'Something went wrong, please try again';
    }

    return (
      <div className={className}>
        <form className="czi-form">
          <fieldset>
            <legend>Upload Image</legend>
            <div className="czi-image-upload-editor-body">
              <div className="czi-image-upload-editor-label">{label}</div>
              <input
                accept="image/png,image/gif,image/jpeg,image/jpg"
                className="czi-image-upload-editor-input"
                disabled={pending}
                id={id}
                key={id}
                onChange={this._onSelectFile}
                type="file"
              />
            </div>
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
          </div>
        </form>
      </div>
    );
  }

  _onSelectFile = (event: SyntheticInputEvent): void => {
    const file = event.target.files && event.target.files[0];
    if (file && typeof file === 'object') {
      this._upload(file);
    }
  };

  _onSuccess = (image: ImageLike): void => {
    if (this._unmounted) {
      return;
    }
    this.props.close(image);
  };

  _onError = (error: Error): void => {
    if (this._unmounted) {
      return;
    }
    this.setState({
      error,
      id: uuid(),
      pending: false,
      validValue: null,
    });
  };

  _upload = async (file: Object): Promise<void> => {
    try {
      const runtime = this.props.runtime || {};
      const {canUploadImage, uploadImage} = runtime;
      if (!canUploadImage || !uploadImage || !canUploadImage()) {
        throw new Error('feature is not available');
      }
      this.setState({pending: true, error: null});
      const image = await uploadImage(file);
      this._onSuccess(image);
    } catch (ex) {
      this._onError(ex);
    }
  };

  _cancel = (): void => {
    this.props.close();
  };
}

export default ImageUploadEditor;
