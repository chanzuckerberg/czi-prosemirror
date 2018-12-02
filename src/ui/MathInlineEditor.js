// @flow

import './czi-inline-editor.css';
import CustomButton from './CustomButton';
import CustomNodeView from './CustomNodeView';
import React from 'react';

const MathAlignValues = {
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
    text: 'Break text',
  },
  RIGHT: {
    value: 'right',
    text: 'Float right',
  },
};

export type MathInlineEditorValue = {
  align: ?string,
};

class MathInlineEditor extends React.PureComponent<any, any, any> {

  props: {
    onSelect: (val: MathInlineEditorValue) => void,
    value: ?MathInlineEditorValue,
  };

  render(): React.Element<any> {
    const align = this.props.value ? this.props.value.align : null;
    const onClick = this._onClick;
    const buttons = Object.keys(MathAlignValues).map(key => {
      const {value, text} = MathAlignValues[key];
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
      <div className="czi-inline-editor">
        {buttons}
      </div>
    );
  }

  _onClick = (align: ?string): void => {
    this.props.onSelect({align: align});
  };
}

export default MathInlineEditor;
