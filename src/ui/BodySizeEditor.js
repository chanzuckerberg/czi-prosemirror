// @flow

import './czi-form.css';
import CustomButton from './CustomButton';
import React from 'react';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

export type BodySizeEditorValue = {
  width: ?number,
  landscape: ?boolean,
};

const LANDSCAPE = 'landscape';

class BodySizeEditor extends React.PureComponent<any, any, any> {

  _unmounted = false;

  props: {
    initialValue: ?BodySizeEditorValue,
    close: (val: ?BodySizeEditorValue) => void,
  };

  state = {
    ...(this.props.initialValue || {}),
  };


  render(): React.Element<any> {
    const {width, landspace} = this.state;
    const customOption = width ?
      <label key="custom">
        <input name="page_size" type="radio" value={width} />
        <span>{width}</span>
      </label> :
      null;

    return (
      <div className="czi-body-size-editor">
        <form className="czi-form">
          <fieldset>
            <legend>Page Size</legend>
            {customOption}
            <input name="page_size" type="radio" value={LANDSCAPE} />
            <input name="page_size" type="radio" value="" />
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
            <CustomButton
              label="Apply"
              onClick={this._apply}
            />
          </div>
        </form>
      </div>
    );
  }

  _cancel = (): void => {
    this.props.close();
  };

  _apply = (): void => {

  };
}

export default BodySizeEditor;
