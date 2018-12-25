// @flow

import applyDevTools from 'prosemirror-dev-tools';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';
import ReactDOM from 'react-dom';

import convertFromDOMElement from '../src/convertFromDOMElement';
import RichTextEditor from '../src/ui/RichTextEditor';
import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';
import DemoAppRuntime from './DemoAppRuntime';

import './demo-app.css';

// import initCollabEdit from './initCollabEdit';


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
      editorView: null,
    };
  }

  render(): React.Element<any> {
    const {editorState} = this.state;
    const readOnly = /read/ig.test(window.location.search);
    return (
      <RichTextEditor
        editorState={editorState}
        embedded={false}
        height="100vh"
        onChange={this._onChange}
        placeholder={readOnly ? '' : 'Type Something...'}
        readOnly={readOnly}
        runtime={this._runtime}
        width="100vw"
      />
    );
  }

  _onChange = (data: {state: EditorState, transaction: Transform}): void => {
    const {state, transaction} = data;
    const editorState = state.apply(transaction);
    this.setState({editorState});
  };

  _onReady = (editorView: EditorView): void => {
    window.debugProseMirror = () => {
      applyDevTools(editorView);
    };
  };
}

export default DemoApp;
