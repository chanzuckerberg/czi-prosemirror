// @flow

import {baseKeymap} from 'prosemirror-commands';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {history} from 'prosemirror-history';
import {keymap} from 'prosemirror-keymap';
import {Schema} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import DocNodeSpec from '../src//DocNodeSpec';
import * as EditorCommands from '../src/EditorCommands';
import HardBreakNodeSpec from '../src/HardBreakNodeSpec';
import LinkMarkSpec from '../src/LinkMarkSpec';
import LinkTooltipPlugin from '../src/LinkTooltipPlugin';
import * as MarkNames from '../src/MarkNames';
import * as NodeNames from '../src/NodeNames';
import ParagraphNodeSpec from '../src/ParagraphNodeSpec';
import SelectionPlaceholderPlugin from '../src/SelectionPlaceholderPlugin';
import StrongMarkSpec from '../src/StrongMarkSpec';
import TextNodeSpec from '../src/TextNodeSpec';
import buildInputRules from '../src/buildInputRules';
import convertFromHTML from '../src/convertFromHTML';
import convertFromJSON from '../src/convertFromJSON';
import createEditorKeyMap from '../src/createEditorKeyMap';
import createEmptyEditorState from '../src/createEmptyEditorState';
import CommandButton from '../src/ui/CommandButton';
import Editor from '../src/ui/Editor';
import EditorFrameset from '../src/ui/EditorFrameset';
import Icon from '../src/ui/Icon';

import './simple-editor.css';

// Schema Nodes that <SimpleEditor /> can use.
// See https://prosemirror.net/examples/schema/
const {
  DOC,
  HARD_BREAK,
  PARAGRAPH,
  TEXT,
} = NodeNames;

// Schema Marks that <SimpleEditor /> can use.
// See https://prosemirror.net/examples/schema/
const {
  MARK_LINK,
  MARK_STRONG,
} = MarkNames;

// Commands that <SimpleEditor /> can use.
const {
  HISTORY_REDO,
  HISTORY_UNDO,
  LINK_SET_URL,
  STRONG,
} = EditorCommands;

// Create the nodes mapping for schema. Please see `EditorNodes` for all the
// nodes available.
const NODES = {
  [DOC]: DocNodeSpec,
  [PARAGRAPH]: ParagraphNodeSpec,
  [TEXT]: TextNodeSpec,
  [HARD_BREAK]: HardBreakNodeSpec,
};

// Creates the marks mapping for schema. Please see `EditorMarks` for all the
// marks available.
const MARKS = {
  [MARK_LINK]: LinkMarkSpec,
  [MARK_STRONG]: StrongMarkSpec,
};

// Create the schema.
// See https://prosemirror.net/examples/schema/
const SCHEMA = new Schema({nodes: NODES, marks: MARKS});

// Define the plugins. Please see `EditorPlugins` for all the plugins
// available.
const PLUGINS = [
  // Plugin to let user edit link's url inline.
  new LinkTooltipPlugin(),

  // Plugin to persist user's text selection visible when the is not focsued.
  new SelectionPlaceholderPlugin(),

  // Basic behaviors.
  buildInputRules(SCHEMA),
  dropCursor(),
  gapCursor(),
  history(),

  // Basic keyboard shotcuts.
  keymap(createEditorKeyMap()),
  keymap(baseKeymap),
];

// This defines a simple editor that only supports plain-text, web link and bold
// style. You may use this as an example to customize editor with custom schema.
class SimpleEditor extends React.PureComponent<any, any, any> {

  static convertFromJSON = (json: string | Object):EditorState => {
    return convertFromJSON(json, SCHEMA, PLUGINS);
  };

  static convertFromHTML = (html: string):EditorState => {
    return convertFromHTML(html, SCHEMA, PLUGINS);
  };

  static createEmptyEditorState = (): EditorState => {
    return createEmptyEditorState(SCHEMA, PLUGINS);
  };

  state = {
    editorView: null,
  };

  render(): React.Element<any> {
    const {editorView} = this.state;
    const {editorState} = this.props;
    const toolbar =
      <div className="simple-editor-toolbar">
        <CommandButton
          command={HISTORY_UNDO}
          dispatch={this._dispatchTransaction}
          editorState={editorState}
          editorView={editorView}
          icon={Icon.get('undo')}
          title="Undo"
        />
        <CommandButton
          command={HISTORY_REDO}
          dispatch={this._dispatchTransaction}
          editorState={editorState}
          editorView={editorView}
          icon={Icon.get('redo')}
          title="Redo"
        />
        <CommandButton
          command={LINK_SET_URL}
          dispatch={this._dispatchTransaction}
          editorState={editorState}
          editorView={editorView}
          icon={Icon.get('link')}
          title="link"
        />
        <CommandButton
          command={STRONG}
          dispatch={this._dispatchTransaction}
          editorState={editorState}
          editorView={editorView}
          icon={Icon.get('format_bold')}
          title="link"
        />
      </div>;
    const body =
      <Editor
        dispatchTransaction={this._dispatchTransaction}
        editorState={editorState}
        onReady={this._onReady}
      />;
    return (
      <EditorFrameset
        body={body}
        className="simple-editor"
        height={400}
        toolbar={toolbar}
        width={500}
      />
    );
  }

  _dispatchTransaction = (tr: Transform): void => {
    const {onChange, editorState} = this.props;
    if (onChange) {
      const prevState =  editorState || SimpleEditor.createEmptyEditorState();
      const nextState = prevState.apply(tr);
      onChange(nextState);
    }
  };

  _onReady = (editorView: EditorView): void => {
    if (editorView !== this.state.editorView) {
      this.setState({editorView});
    }
  };
}

export default SimpleEditor;
