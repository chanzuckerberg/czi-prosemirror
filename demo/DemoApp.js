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
    const readOnly = /read/ig.test(window.location.search);
    return (
      <RichTextEditor
        editorState={editorState}
        embedded={false}
        height="100vh"
        onChange={this._onChange}
        onReady={this._onReady}
        readOnly={readOnly}
        width="100vw"
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
