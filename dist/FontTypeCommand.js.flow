// @flow

import React from 'react';
import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_FONT_TYPE} from './MarkNames';
import {Schema} from 'prosemirror-model';
import {AllSelection, TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

function setFontType(
  tr: Transform,
  schema: Schema,
  name: string,
): Transform {
  const markType = schema.marks[MARK_FONT_TYPE];
  if (!markType) {
    return tr;
  }
  const {selection} = tr;
  if (!(
    selection instanceof TextSelection ||
    selection instanceof AllSelection
  )) {
    return tr;
  }
  const attrs = name ? {name} : null;
  tr = applyMark(
    tr,
    schema,
    markType,
    attrs,
  );
  return tr;
}

class FontTypeCommand extends UICommand {

  _label = null;
  _name = '';
  _popUp = null;

  constructor(name: string) {
    super();
    this._name = name;
    this._label = name ?
      <span style={{fontFamily: name}}>{name}</span> :
      null;
  }

  renderLabel = (state: EditorState): any => {
    return this._label;
  };

  isEnabled = (state: EditorState): boolean => {
    const {schema, selection} = state;
    if (!(
      selection instanceof TextSelection ||
      selection instanceof AllSelection
    )) {
      return false;
    }
    const markType = schema.marks[MARK_FONT_TYPE];
    if (!markType) {
      return false;
    }
    return !selection.empty;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {schema, selection} = state;
    const tr = setFontType(
      state.tr.setSelection(selection),
      schema,
      this._name,
    );
    if (dispatch && tr.docChanged) {
      dispatch(tr);
      return true;
    }
    return false;
  };
}

export default FontTypeCommand;
