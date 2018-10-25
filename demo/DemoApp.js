// @flow

import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';
import DemoAppTollbar from './DemoAppTollbar';
import React from 'react';
import {DOMParser} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import applyDevTools from "prosemirror-dev-tools";

import {
  EDITOR_EMPTY_STATE,
  PLUGINS,
  SCHEMA,
} from '../src/configs';


import 'prosemirror-view/style/prosemirror.css';
// import 'prosemirror-gapcursor/style/gapcursor.css';
// import 'prosemirror-view/style/prosemirror.css';
// import 'prosemirror-menu/style/menu.css';
// import 'prosemirror-example-setup/style/style.css';

import './DemoApp.css';
import '../src/DocsEditor.css';

type Transaction = any;

function sleep(delay: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}


class DemoApp extends React.PureComponent<any, any, any> {

  _id = `demo-app-editor-${Date.now()}`;

  _editorView = null;

  state = {
    editorState: EDITOR_EMPTY_STATE,
  };

  componentDidMount(): void {
    const editorNode = document.getElementById(this._id);
    const templateNode = document.getElementById(this._id + 'template');

    if (editorNode) {
      // Reference: http://prosemirror.net/examples/basic/
      const editorState = EditorState.create({
        doc: DOMParser.fromSchema(SCHEMA).parse(templateNode),
        plugins: PLUGINS,
      });

      this.setState({editorState});

      this._editorView = new EditorView(editorNode, {
        state: editorState,
        dispatchTransaction: this._dispatchTransaction,
        editable: () =>  true,
      });

      applyDevTools(this._editorView);

      (async function() {
        await sleep(500);
        const el: any = document.querySelector('.__prosemirror-dev-tools__');
        el && el.firstElementChild && el.firstElementChild.click();
        await sleep(500);
        Array.from(document.querySelectorAll('div')).some(el => {
          if (el.textContent === 'Structure') {
            el.click();
          }
        });
      })();
    }
  }

  render(): React.Element<any> {
    const {editorState} = this.state;
    const editorView = this._editorView;
    return (
      <div className="demo-app">
        <DemoAppHTMLTemplate id={this._id} />
        <DemoAppTollbar
          editorState={editorState}
          editorView={editorView}
          dispatch={this._dispatchTransaction}
        />
        <div id={this._id} className="cuneiform-editor" />
      </div>
    );
  }

  _dispatchTransaction = (transaction: Transaction): void => {
    const {onChange} = this.props;
    const editorState = this.state.editorState.apply(transaction);
    const editorView = this._editorView;
    if (editorView) {
      this.setState({editorState});
      editorView.updateState(editorState);
    }
  };
}

export default DemoApp;
