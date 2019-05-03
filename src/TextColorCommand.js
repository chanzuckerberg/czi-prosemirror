// @flow

import ColorEditor from './ui/ColorEditor';
import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import findNodesWithSameMark from './findNodesWithSameMark';
import isTextStyleMarkCommandEnabled from './isTextStyleMarkCommandEnabled';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_TEXT_COLOR} from './MarkNames';
import {Transform} from 'prosemirror-transform';

class TextColorCommand extends UICommand {
  _popUp = null;

  isEnabled = (state: EditorState): boolean => {
    return isTextStyleMarkCommandEnabled(state, MARK_TEXT_COLOR);
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(undefined);
    }
    const target = nullthrows(event).currentTarget;
    if (!(target instanceof HTMLElement)) {
      return Promise.resolve(undefined);
    }

    const {doc, selection, schema} = state;
    const markType = schema.marks[MARK_TEXT_COLOR];
    const anchor = event ? event.currentTarget : null;
    const {from, to} = selection;
    const result = findNodesWithSameMark(doc, from, to, markType);
    const hex = result ? result.mark.attrs.color : null;
    return new Promise(resolve => {
      this._popUp = createPopUp(
        ColorEditor,
        {hex},
        {
          anchor,
          onClose: val => {
            if (this._popUp) {
              this._popUp = null;
              resolve(val);
            }
          },
        }
      );
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    color: ?string
  ): boolean => {
    if (dispatch && color !== undefined) {
      const {schema} = state;
      let {tr} = state;
      const markType = schema.marks[MARK_TEXT_COLOR];
      const attrs = color ? {color} : null;
      tr = applyMark(
        state.tr.setSelection(state.selection),
        schema,
        markType,
        attrs
      );
      if (tr.docChanged || tr.storedMarksSet) {
        // If selection is empty, the color is added to `storedMarks`, which
        // works like `toggleMark`
        // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
        dispatch && dispatch(tr);
        return true;
      }
    }
    return false;
  };
}

export default TextColorCommand;
