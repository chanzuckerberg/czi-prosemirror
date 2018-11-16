// @flow

import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {FONT_PT_SIZES} from './FontSizeMarkSpec';
import {MARK_FONT_SIZE} from './MarkNames';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

function createGroup(): Array<{[string]: FontSizeCommand}> {
  const group = {};
  FONT_PT_SIZES.forEach((pxSize, ii) => {
    const ptSize = FONT_PT_SIZES[ii];
    // Chrome re-ordering object keys if numerics, is that normal/expected
    // add extra space to prevent that.
    const label = ` ${ptSize} `;
    group[label] = new FontSizeCommand(ptSize);
  });
  return [group];
}

function setFontSize(
  tr: Transform,
  schema: Schema,
  size: number,
): Transform {
  const markType = schema.marks[MARK_FONT_SIZE];
  if (!markType) {
    return tr;
  }
  const {selection} = tr;
  if (!(selection instanceof TextSelection)) {
    return tr;
  }
  const attrs = size ? {size: `${size}pt`} : null;
  tr = applyMark(
    tr,
    schema,
    markType,
    attrs,
  );
  return tr;
}

class FontSizeCommand extends UICommand {

  static createGroup = createGroup;

  _popUp = null;
  _pxSize = 0;

  constructor(pxSize: number) {
    super();
    this._pxSize = pxSize;
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
      this._pxSize,
    );
    if (dispatch && tr.docChanged) {
      dispatch(tr);
      return true;
    }
    return false;
  };
}

export default FontSizeCommand;
