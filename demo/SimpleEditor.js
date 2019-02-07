// @flow

import {EditorState} from 'prosemirror-state';
import React from 'react';

import convertFromHTML from '../src/convertFromHTML';
import convertFromJSON from '../src/convertFromJSON';
import createEmptyEditorState from '../src/createEmptyEditorState';
import Editor from '../src/ui/Editor';
import EditorFrameset from '../src/ui/EditorFrameset';

import './simple-editor.css';

class SimpleEditor extends React.PureComponent<any, any, any> {

  static convertFromJSON = (json: string | Object):EditorState => {
    return convertFromJSON(json);
  };

  static convertFromHTML = (html: string):EditorState => {
    return convertFromHTML(html);
  };

  static createEmptyEditorState = (): EditorState => {
    return createEmptyEditorState();
  };

  render(): React.Element<any> {
    const {editorState, onChange} = this.props;
    const toolbar = <div>toolbar</div>;
    const body =
      <Editor
        editorState={editorState}
        onChange={onChange}
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
}

export default SimpleEditor;
