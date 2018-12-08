// @flow

import './czi-inline-editor.css';
import CustomButton from './CustomButton';
import CustomEditorView from './CustomEditorView';
import MathEditor from './MathEditor';
import React from 'react';
import createPopUp from './createPopUp';

const MathAlignValues = {
  NONE: {
    value: null,
    text: 'Inline',
  },
  // LEFT: {
  //   value: 'left',
  //   text: 'Float left',
  // },
  CENTER: {
    value: 'center',
    text: 'Break text',
  },
  // RIGHT: {
  //   value: 'right',
  //   text: 'Float right',
  // },
};

export type MathInlineEditorValue = {
  align: ?string,
  latex: string,
};

class MathInlineEditor extends React.PureComponent<any, any, any> {

  props: {
    onSelect: (val: MathInlineEditorValue) => void,
    value: ?MathInlineEditorValue,
    editorView: ?CustomEditorView,
  };

  _popUp= null;

  componentWillUnmount(): void {
    this._popUp && this._popUp.close();
  }

  render(): React.Element<any> {
    const {align, latex} = (this.props.value || {});
    const onClick = this._onClick;
    const buttons = Object.keys(MathAlignValues).map(key => {
      const {value, text} = MathAlignValues[key];
      return (
        <CustomButton
          active={align === value}
          key={key}
          label={text}
          onClick={onClick}
          value={value}
        />
      );
    });

    return (
      <div className="czi-inline-editor">
        {buttons}
        <CustomButton
          key="edit"
          label="Edit"
          onClick={this._editLatex}
          value={latex || ''}
        />
      </div>
    );
  }

  _onClick = (align: ?string): void => {
    const value = this.props.value || {};
    this.props.onSelect({...value, align});
  };

  _editLatex = (latex: string): void => {
    if (this._popUp) {
      return;
    }
    const {editorView, value} = this.props;
    const props = {
      runtime: editorView ? editorView.runtime : null,
      initialValue: (value && value.latex || ''),
    };
    this._popUp = createPopUp(MathEditor, props, {
      modal: true,
      onClose: (latex) => {
        if (this._popUp) {
          this._popUp = null;
          if (latex !== undefined) {
            const value = this.props.value || {};
            this.props.onSelect({...value, latex});
          }
        }
      }
    });
  };
}

export default MathInlineEditor;
