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

class LinkURLEditor extends React.PureComponent<any, any, any> {

  props: {
    initialValue: ?LinkURLEditorValue,
    close: (val: ?LinkURLEditorValue) => void,
  };

  state = {
    ...(this.props.initialValue || {}),
  };

  render(): React.Element<any> {
    const {href} = this.state;
    return (
      <div className="czi-image-url-editor">
        <form className="czi-form">
          <fieldset>
            <legend>Add A Link</legend>
            <input
              autoFocus={true}
              onChange={this._onHrefChange}
              placeholder="Paste a URL"
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
              active={!!href}
              disabled={!href}
              label="Apply"
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
