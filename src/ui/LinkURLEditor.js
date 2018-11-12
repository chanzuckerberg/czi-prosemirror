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

export type LinkURLEditorValue = {
  href: ?string,
};

const BAD_CHARACTER_PATTER = /\s/;

class LinkURLEditor extends React.PureComponent<any, any, any> {

  props: {
    initialValue: ?LinkURLEditorValue,
    close: (val: ?LinkURLEditorValue) => void,
  };

  state = {
    ...(this.props.initialValue || {}),
  };

  render(): React.Element<any> {
    const {initialValue} = this.props;
    const {href} = this.state;
    const error = BAD_CHARACTER_PATTER.test(href || '');

    let label = 'Apply';
    let disabled = !!error;
    if (initialValue && initialValue.href) {
      label = href ? 'Apply' : 'Remove';
    } else {
      disabled = error || !href;
    }

    return (
      <div className="czi-image-url-editor">
        <form className="czi-form">
          <fieldset>
            <legend>Add A Link</legend>
            <input
              autoFocus={true}
              onChange={this._onHrefChange}
              placeholder="Paste a URL"
              spellCheck={false}
              type="text"
              value={href || ''}
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

  _onHrefChange = (e: SyntheticInputEvent) => {
    const href = e.target.value;
    this.setState({
      href,
    });
  };

  _cancel = (): void => {
    this.props.close();
  };

  _apply = (): void => {
    const {href} = this.state;
    this.props.close({href});
  };
}

export default LinkURLEditor;
