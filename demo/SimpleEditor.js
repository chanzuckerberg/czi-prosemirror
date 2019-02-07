// @flow

import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import createEmptyEditorState from '../src/createEmptyEditorState';
import Editor from '../src/ui/Editor';
import EditorFrameset from '../src/ui/EditorFrameset';
import uuid from '../src/ui/uuid';

class SimpleEditor extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    const toolbar = <div>toolbar</div>;
    const body = <div>body</div>;
    return (
      <EditorFrameset
        body={body}
        className="simple-editor"
        height={200}
        toolbar={toolbar}
        width={400}
      />
    );
  }
}

export default SimpleEditor;
