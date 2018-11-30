// @flow

import './czi-form.css';
import './czi-math-editor.css';
import CustomButton from './CustomButton';
import React from 'react';
import cx from 'classnames';
import uuid from './uuid';

import type {MathValue} from '../Types';

type MessageDetail = {
  id: string,
  value: MathValue,
  contentLayout: {
    height: number,
    width: number,
  },
  symbolsGuide: {[string]: string},
};

// This file is manually built and uploaded to S3.
// See https://github.com/FB-PLP/react-math-input-app
const GUPPY_CDN_URL =
  '//cdn.summitlearning.org/assets/app_react_math_input_app_0_0_3_8.html';


class MathEditor extends React.PureComponent<any, any, any> {

  props: {
    initialValue: ?MathValue,
    close: (val: ?MathValue) => void,
  };

  state = {
    value: Object.assign({}, this.props.initialValue || {}),
    contentHeight: 0,
    contentWidth: 0,
    showGuide: false,
    symbolsGuide: null,
  };

  _id = uuid();
  _unmounted = false;

  render(): React.Element<any> {
    const {value, contentHeight, contentWidth, symbolsGuide} = this.state;
    const {xml} = value;

    const id = this._id;
    const params = JSON.stringify({value, id});

    // The math input must be hosted as a sandboxed app because it observe
    // DOM events at global level and it does not release the event handlers
    // when the editor is closed.
    const iframeSrc = GUPPY_CDN_URL + '#' + window.encodeURIComponent(params);
    const iframeStyle = {
      height: Math.max(contentHeight, 80) + 'px',
      width: Math.max(contentWidth, 500) + 'px',
      opacity: symbolsGuide ? 1 : 0,
    };

    const className = cx('czi-math-editor');

    return (
      <div className={className}>
        <form className="czi-form">
          <fieldset>
            <legend>Insert Math</legend>
            <iframe
              className="czi-math-editor-iframe"
              src={iframeSrc}
              style={iframeStyle}
            />
          </fieldset>

          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
            <CustomButton
              label="Insert"
              onClick={this._insert}
            />
          </div>
        </form>
      </div>
    );
  }

  componentDidMount(): void {
    window.addEventListener('message', this._onMessage, false);
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    window.removeEventListener('message', this._onMessage, false);
  }

  _onMessage = (e: any): void => {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (ex) {
      return;
    }
    if (!data || !data.detail || data.detail.id !== this._id) {
      return;
    }

    const detail: MessageDetail = data.detail;
    const {value, contentLayout, symbolsGuide} = detail;
    if (!this.state.symbolsGuide) {
      this.setState({
        symbolsGuide,
      });
    }
    this.setState({
      contentHeight: contentLayout.height,
      contentWidth: contentLayout.width,
      value,
    });
  };

  _cancel = (): void => {
    this.props.close();
  };

  _insert = (): void => {
    this.props.close(this.state.value);
  };
}

export default MathEditor;
