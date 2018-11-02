// @flow

import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';
import Editor from '../src/ui/Editor';
import EditorToolbar from '../src/ui/EditorToolbar';
import React from 'react';
import ReactDOM from 'react-dom';
import applyDevTools from "prosemirror-dev-tools";
import {DOMParser} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

import {
  EDITOR_EMPTY_STATE,
  PLUGINS,
  SCHEMA,
} from '../src/configs';

import './DemoApp.css';

import {Transform} from 'prosemirror-transform';

function sleep(delay: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

// Reference: http://prosemirror.net/examples/basic/
const defaultEditorState = (function() {
  const templateNode = document.createElement('div');
  ReactDOM.render(<DemoAppHTMLTemplate />, templateNode);
  return EditorState.create({
    doc: DOMParser.fromSchema(SCHEMA).parse(templateNode),
    plugins: PLUGINS,
  });
})();

class DemoApp extends React.PureComponent<any, any, any> {

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      editorState: defaultEditorState,
      editorView: null,
    };
  }

  render(): React.Element<any> {
    const {editorState, editorView} = this.state;
    return (
      <div className="demo-app">
        <div className="demo-app-head">
          <EditorToolbar
            editorState={editorState}
            editorView={editorView}
            onChange={this._onChange}
          />
        </div>
        <div className="demo-app-body">
          <Editor
            editorState={this.state.editorState}
            onChange={this._onChange}
            onReady={this._onReady}
          />
        </div>
      </div>
    );
  }

  _onChange = (editorState: EditorState): void => {
    this.setState({editorState});
  };

  _onReady = (editorView: EditorView): void => {
    if (editorView !== this.state.editorView) {
      this.setState({editorView});
    }

    applyDevTools(editorView);

    (async function() {
      // Opens the debugger and select the "Structure" tab.
      // await sleep(500);
      // const el: any = document.querySelector('.__prosemirror-dev-tools__');
      // el && el.firstElementChild && el.firstElementChild.click();
      // await sleep(500);
      // Array.from(document.querySelectorAll('div')).some(el => {
      //   if (el.textContent === 'Structure') {
      //     el.click();
      //   }
      // });
    })();
  };
}

export default DemoApp;
