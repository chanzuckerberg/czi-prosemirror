// @flow

import React from 'react';

import {LAYOUT} from '../DocNodeSpec';
import CustomButton from './CustomButton';
import CustomRadioButton from './CustomRadioButton';
import preventEventDefault from './preventEventDefault';

import './czi-body-layout-editor.css';
import './czi-form.css';

export type DocLayoutEditorValue = {
  layout: ?string,
  width: ?number,
};

type Props = {
  initialValue: ?DocLayoutEditorValue,
  close: (val: ?DocLayoutEditorValue) => void,
};

type State = {
  layout: ?string,
  selectedValue: any,
  width: ?number,
};

class DocLayoutEditor extends React.PureComponent<any, any, any> {

  _unmounted = false;

  props: Props;
  state: State;

  constructor(props: Object, context: Object) {
    super(props, context);
    const {width, layout} = (this.props.initialValue || {});
    this.state = {
      width,
      layout,
      selectedValue: width || layout || LAYOUT.US_LETTER_PORTRAIT,
    };
  }

  render(): React.Element<any> {
    const {width, selectedValue} = this.state;
    const customOption = width ?
      <CustomRadioButton
        checked={selectedValue === width}
        key="c"
        label={`Custom width: ${width}pt`}
        onSelect={this._onSelect}
        value={width}
      /> :
      null;

    return (
      <div className="czi-body-layout-editor">
        <form className="czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>Page Layout</legend>
            <CustomRadioButton
              checked={selectedValue === LAYOUT.US_LETTER_PORTRAIT}
              label="US Letter - Portrait"
              onSelect={this._onSelect}
              value={LAYOUT.US_LETTER_PORTRAIT}
            />
            <CustomRadioButton
              checked={selectedValue === LAYOUT.US_LETTER_LANDSCAPE}
              label="US Letter - Landscape"
              onSelect={this._onSelect}
              value={LAYOUT.US_LETTER_LANDSCAPE}
            />
            <CustomRadioButton
              checked={selectedValue === LAYOUT.DESKTOP_SCREEN_4_3}
              label="4:3 Desktop Screen"
              onSelect={this._onSelect}
              value={LAYOUT.DESKTOP_SCREEN_4_3}
            />
            <CustomRadioButton
              checked={selectedValue === LAYOUT.DESKTOP_SCREEN_16_9}
              label="16:9 Desktop Screen"
              onSelect={this._onSelect}
              value={LAYOUT.DESKTOP_SCREEN_16_9}
            />
            {customOption}
          </fieldset>
          <hr />
          <div className="czi-form-buttons">
            <CustomButton
              label="Cancel"
              onClick={this._cancel}
            />
            <CustomButton
              active={true}
              label="Apply"
              onClick={this._apply}
            />
          </div>
        </form>
      </div>
    );
  }

  _onSelect = (selectedValue: any): void => {
    this.setState({selectedValue});
  };

  _cancel = (): void => {
    this.props.close();
  };

  _apply = (): void => {
    const {selectedValue} = this.state;
    if (typeof selectedValue === 'string') {
      this.props.close({width: null, layout: selectedValue});
    } else {
      this.props.close({width: selectedValue, layout: null});
    }
  };
}

export default DocLayoutEditor;
