// @flow

import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import React from 'react';
import ReactDOM from 'react-dom';

import * as CZIProseMirror from '../src/CZIProseMirror';
import {HR} from '../src/EditorCommands';
import convertFromDOMElement from '../src/convertFromDOMElement';
import RichTextEditor from '../src/ui/RichTextEditor';
import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';
import DemoAppRuntime from './DemoAppRuntime';

import './demo-app.css';

// Reference: http://prosemirror.net/examples/basic/
const defaultEditorState = (function() {
  const templateNode = document.createElement('div');
  ReactDOM.render(<DemoAppHTMLTemplate />, templateNode);
  return convertFromDOMElement(templateNode);
})();

class DemoApp extends React.PureComponent<any, any, any> {
  _runtime = new DemoAppRuntime();

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      editorState: defaultEditorState,
    };
  }

  render(): React.Element<any> {
    const {editorState} = this.state;
    const readOnly = /read/gi.test(window.location.search);
    return (
      <RichTextEditor
        autoFocus={true}
        editorState={editorState}
        embedded={false}
        height="100%"
        onChange={this._onChange}
        onReady={this._onReady}
        placeholder={readOnly ? '' : 'Type Something...'}
        readOnly={readOnly}
        runtime={this._runtime}
        width="100%"
      />
    );
  }

  _onChange = (editorState: EditorState): void => {
    this.setState({editorState});
  };

  _onReady = (editorView: EditorView): void => {
    CZIProseMirror.registerCommand('hr', HR);
    window.CZIProseMirror = CZIProseMirror;
  };
}

export default DemoApp;
