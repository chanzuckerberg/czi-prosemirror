// @flow

import FontTypeCommand from '../FontTypeCommand';
import React from 'react';
import UICommand from './UICommand';
import cx from 'classnames';
import findActiveMark from '../findActiveMark';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_FONT_TYPE} from '../MarkNames';
import {Transform} from 'prosemirror-transform';

const FONT_TYPE_NAMES = [
  // SERIF
 'Arial',
 'Arial Black',
 'Georgia',
 'Tahoma',
 'Times New Roman',
 'Times',
 'Verdana',
 // MONOSPACE
 'Courier New',
 'Lucida Console',
 'Monaco',
 'monospace',
];

function findActiveFontType(editorState: EditorState): string {
  const {schema, doc, selection} = editorState;
  const markType = editorState.schema.marks[MARK_FONT_TYPE];
  const {from, to} = selection;
  const mark = markType ? findActiveMark(doc, from, to, markType) : null;
  return (mark && mark.attrs.name) || String(FONT_TYPE_NAMES[0]);
}

class FontTypeCommandMenuButton extends React.PureComponent<any, any, any> {

  props: {
    dispatch: (tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
  };

  render(): React.Element<any> {

    return (
      <div>FontTypeCommandMenuButton</div>
    );
  }

}


export default FontTypeCommandMenuButton;
