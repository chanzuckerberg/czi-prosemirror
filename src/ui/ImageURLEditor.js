// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import CustomButton from './CustomButton';
import preventEventDefault from './preventEventDefault';
import resolveImage from './resolveImage';

import './czi-form.css';
import './czi-image-url-editor.css';

import type {ImageLike} from '../Types';

type Props = {
  initialValue: ?ImageLike,
  close: (href: ?ImageLike) => void,
}; 

class ImageURLEditor extends React.PureComponent<any, any> {
  _img = null;
  _unmounted = false;

  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  static propsTypes = {
    initialValue: PropTypes.object,
	close: function(props:any, propName:string) {
        var fn = props[propName];
        if(!fn.prototype ||
           (typeof fn.prototype.constructor !== 'function' &&
            fn.prototype.constructor.length !== 1)) {
            return new Error(propName + 'must be a function with 1 arg of type ImageLike');
        }
    }
  }

  state = {
    ...(this.props.initialValue || {}),
    validValue: null,
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.Element<any> {
    const {src, validValue} = this.state;
    const preview = validValue ? (
      <div
        className="czi-image-url-editor-input-preview"
        style={{backgroundImage: `url(${String(validValue.src)}`}}
      />
    ) : null;

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
                placeholder="Paste URL of Image..."
                type="text"
                value={src || ''}
              />
              {preview}
            </div>
            <em>
              Only select image that you have confirmed the license to use
            </em>
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton label="Cancel" onClick={this._cancel} />
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

  _onSrcChange = (e: SyntheticInputEvent<>) => {
    const src = e.target.value;
    this.setState(
      {
        src,
        validValue: null,
      },
      this._didSrcChange
    );
  };

  _didSrcChange = (): void => {
    resolveImage(this.state.src).then(result => {
      if (this.state.src === result.src && !this._unmounted) {
        const validValue = result.complete ? result : null;
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
