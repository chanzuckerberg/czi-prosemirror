// @flow

import renderLaTeXAsHTML from '../renderLaTeXAsHTML';
import './czi-mathquill-editor-symbols-panel.css';
import CustomButton from '../CustomButton';
import React from 'react';

import type {MathQuillEditorSymbol} from './MathQuillEditorSymbols';

class MathQuillEditorSymbolsPanel extends React.PureComponent<any, any, any> {
  props: {
    onSelect: (symbol: MathQuillEditorSymbol) => void,
    symbols: {
      title: string,
      symbols: Array<MathQuillEditorSymbol>,
    },
    title: string,
  };

  render(): React.Element<any> {
    const {title, symbols} = this.props.symbols;
    const buttons = symbols.map(this._renderButton);
    return (
      <div className="czi-mathquill-editor-symbols-panel">
        <div className="czi-mathquill-editor-symbols-panel-title">{title}</div>
        <div className="czi-mathquill-editor-symbols-panel-body">{buttons}</div>
      </div>
    );
  }

  _renderButton = (symbol: MathQuillEditorSymbol): React.Element<any> => {
    const {label, latex, description} = symbol;
    const html = renderLaTeXAsHTML(label);
    const icon = <span dangerouslySetInnerHTML={{__html: html}} />;
    return (
      <CustomButton
        className="czi-mathquill-editor-symbols-panel-button"
        icon={icon}
        key={label + latex}
        onClick={this.props.onSelect}
        title={description}
        value={symbol}
      />
    );
  };
}

export default MathQuillEditorSymbolsPanel;
