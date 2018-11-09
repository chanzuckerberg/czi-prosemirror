// @flow

import './czi-image-align-editor.css';
import CustomButton from './CustomButton';
import CustomNodeView from './CustomNodeView';
import React from 'react';

const ImageAlignValues = {
  NONE: {
    value: null,
    text: 'Inline',
  },
  LEFT: {
    value: 'left',
    text: 'Float left',
  },
  CENTER: {
    value: 'center',
    text: 'Center',
  },
  RIGHT: {
    value: 'right',
    text: 'Float right',
  },
};

export type ImageAlignEditorValue = {
  align: ?string,
};

class ImageAlignEditor extends React.PureComponent<any, any, any> {

  props: {
    onSelect: (val: ImageAlignEditorValue) => void,
    value: ?ImageAlignEditorValue,
  };

  render(): React.Element<any> {
    const align = this.props.value ? this.props.value.align : null;
    const onClick = this._onClick;
    const buttons = Object.keys(ImageAlignValues).map(key => {
      const {value, text} = ImageAlignValues[key];
      return (
        <CustomButton
          key={key}
          active={align === value}
          label={text}
          value={value}
          onClick={onClick}
        />
      );
    });

    return (
      <div className="czi-image-align-editor custom-">
        {buttons}
      </div>
    );
  }

  _onClick = (align: ?string): void => {
    this.props.onSelect({align: align});
  };
}

export default ImageAlignEditor;
