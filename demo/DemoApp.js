// @flow

import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';
import React from 'react';
import ReactDOM from 'react-dom';
import RichTextEditor from '../src/ui/RichTextEditor';
import applyDevTools from "prosemirror-dev-tools";
import convertFromDOMElement from '../src/convertFromDOMElement';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

import './demo-app.css';

// Reference: http://prosemirror.net/examples/basic/
const defaultEditorState = (function() {
  const templateNode = document.createElement('div');
  ReactDOM.render(<DemoAppHTMLTemplate />, templateNode);
  return convertFromDOMElement(templateNode);
})();

class DemoApp extends React.PureComponent<any, any, any> {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      editorState: defaultEditorState,
    };
  }

  render(): React.Element<any> {
    const {editorState, editorView} = this.state;
    return (
      <RichTextEditor
        editorState={editorState}
        height="100vh"
        width="100vw"
        onChange={this._onChange}
        onReady={this._onReady}
      />
    );
  }

  _onChange = (editorState: EditorState): void => {
    this.setState({editorState});
  };

  _onReady = (editorView: EditorView): void => {
    applyDevTools(editorView);
  };
}

export default DemoApp;
