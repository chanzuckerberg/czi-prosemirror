// @flow

import './czi-form.css';
import './czi-image-url-editor.css';
import CustomButton from './CustomButton';
import React from 'react';
import clamp from './clamp';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

const BAD_CHARACTER_PATTER = /\s/;

class LinkURLEditor extends React.PureComponent<any, any, any> {

  props: {
    href: ?string,
    close: (href: ?string) => void,
  };

  state = {
    url: this.props.href,
  };

  render(): React.Element<any> {
    const {href} = this.props;
    const {url} = this.state;

    const error = url ?
      BAD_CHARACTER_PATTER.test(url) :
      false;

    let label = 'Apply';
    let disabled = !!error;
    if (href) {
      label = url ? 'Apply' : 'Remove';
      disabled = error;
    } else {
      disabled = error || !url;
    }

    return (
      <div className="czi-image-url-editor">
        <form className="czi-form">
          <fieldset>
            <legend>Add A Link</legend>
            <input
              autoFocus={true}
              onChange={this._onURLChange}
              placeholder="Paste a URL"
              spellCheck={false}
              type="text"
              value={url || ''}
            />
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
            <CustomButton
              active={true}
              disabled={disabled}
              label={label}
              onClick={this._apply}
            />
          </div>
        </form>
      </div>
    );
  }

  _onURLChange = (e: SyntheticInputEvent) => {
    const url = e.target.value;
    this.setState({
      url,
    });
  };

  _cancel = (): void => {
    this.props.close();
  };

  _apply = (): void => {
    const {url} = this.state;
    this.props.close(url);
  };
}

export default LinkURLEditor;
