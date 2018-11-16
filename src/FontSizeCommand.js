// @flow

import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_FONT_SIZE} from './MarkNames';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

function setFontSize(
  tr: Transform,
  schema: Schema,
  pt: number,
): Transform {
  const markType = schema.marks[MARK_FONT_SIZE];
  if (!markType) {
    return tr;
  }
  const {selection} = tr;
  if (!(selection instanceof TextSelection)) {
    return tr;
  }
  const attrs = pt ? {pt} : null;
  tr = applyMark(
    tr,
    schema,
    markType,
    attrs,
  );
  return tr;
}

class FontSizeCommand extends UICommand {

  _popUp = null;
  _pt = 0;

  constructor(pt: number) {
    super();
    this._pt = pt;
  }

  isEnabled = (state: EditorState): boolean => {
    const {schema, selection} = state;
    if (!(selection instanceof TextSelection)) {
      return false;
    }
    const markType = schema.marks[MARK_FONT_SIZE];
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
    const tr = setFontSize(
      state.tr.setSelection(selection),
      schema,
      this._pt,
    );
    if (dispatch && tr.docChanged) {
      dispatch(tr);
      return true;
    }
    return false;
  };
}

export default FontSizeCommand;
