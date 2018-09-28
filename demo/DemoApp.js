// @flow

import React from 'react';
import {EDITOR_SCHEMA, EDITOR_PLUGINS, EDITOR_EMPTY_STATE} from '../src/configs';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema, DOMParser} from 'prosemirror-model';
import {addListNodes} from "prosemirror-schema-list";
import {baseKeymap} from 'prosemirror-commands';
import {schema} from 'prosemirror-schema-basic';

import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-gapcursor/style/gapcursor.css';
import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';
import 'prosemirror-example-setup/style/style.css';

import './DemoApp.css';

type Transaction = any;

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
        doc: DOMParser.fromSchema(EDITOR_SCHEMA).parse(templateNode),
        plugins: EDITOR_PLUGINS,
      });

      this.setState({editorState});

      this._editorView = new EditorView(editorNode, {
        state: editorState,
        dispatchTransaction: this._dispatchTransaction,
        editable: () =>  true,
      });
    }
  }

  render(): React.Element<any> {
    return (
      <div>
        <div id={this._id + 'template'} className="template">
          <h1>Editor Example</h1>
          <h2>H2 Header</h2>
          <p>paragraph</p>
        </div>
        <div id={this._id} className="editor" />
      </div>
    );
  }

  _dispatchTransaction = (transaction: Transaction): void => {
    const {onChange} = this.props;
    const editorState = this.state.editorState.apply(transaction);
    const editorView = this._editorView;
    if (editorView ) {
      this.setState({editorState});
      editorView .updateState(editorState);
    }
  };
}

export default DemoApp;
