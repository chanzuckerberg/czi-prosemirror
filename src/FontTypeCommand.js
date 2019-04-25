// @flow

import {Schema} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {AllSelection, TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import {MARK_FONT_TYPE} from './MarkNames';
import applyMark from './applyMark';
import UICommand from './ui/UICommand';

function setFontType(tr: Transform, schema: Schema, name: string): Transform {
  const markType = schema.marks[MARK_FONT_TYPE];
  if (!markType) {
    return tr;
  }
  const {selection} = tr;
  if (
    !(selection instanceof TextSelection || selection instanceof AllSelection)
  ) {
    return tr;
  }
  const attrs = name ? {name} : null;
  tr = applyMark(tr, schema, markType, attrs);
  return tr;
}

class FontTypeCommand extends UICommand {
  _label = null;
  _name = '';
  _popUp = null;

  constructor(name: string) {
    super();
    this._name = name;
    this._label = name ? <span style={{fontFamily: name}}>{name}</span> : null;
  }

  renderLabel = (state: EditorState): any => {
    return this._label;
  };

  isEnabled = (state: EditorState): boolean => {
    const {schema, selection, tr} = state;
    if (
      !(selection instanceof TextSelection || selection instanceof AllSelection)
    ) {
      return false;
    }
    const markType = schema.marks[MARK_FONT_TYPE];
    if (!markType) {
      return false;
    }

    const {from, to} = selection;
    if (to === from + 1) {
      const node = tr.doc.nodeAt(from);
      if (node.isAtom && !node.isText && node.isLeaf) {
        // An atomic node (e.g. Image) is selected.
        return false;
      }
    }

    return true;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView
  ): boolean => {
    const {schema, selection} = state;
    const tr = setFontType(
      state.tr.setSelection(selection),
      schema,
      this._name
    );
    if (tr.docChanged || tr.storedMarksSet) {
      // If selection is empty, the color is added to `storedMarks`, which
      // works like `toggleMark`
      // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
      dispatch && dispatch(tr);
      return true;
    }
    return false;
  };
}

export default FontTypeCommand;
