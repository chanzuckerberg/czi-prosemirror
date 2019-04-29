// @flow

import nullthrows from 'nullthrows';
import {AllSelection, TextSelection} from 'prosemirror-state';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import {MARK_TEXT_HIGHLIGHT} from './MarkNames';
import applyMark from './applyMark';
import findNodesWithSameMark from './findNodesWithSameMark';
import ColorEditor from './ui/ColorEditor';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';

class TextHighlightCommand extends UICommand {
  _popUp = null;

  isEnabled = (state: EditorState): boolean => {
    const {selection, schema, tr} = state;
    if (
      !(selection instanceof TextSelection || selection instanceof AllSelection)
    ) {
      // Could be a NodeSelection or CellSelection.
      return false;
    }

    const markType = schema.marks[MARK_TEXT_HIGHLIGHT];
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
    const markType = schema.marks[MARK_TEXT_HIGHLIGHT];
    const {from, to} = selection;
    const result = findNodesWithSameMark(doc, from, to, markType);
    const hex = result ? result.mark.attrs.highlightColor : null;
    const anchor = event ? event.currentTarget : null;
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
      const markType = schema.marks[MARK_TEXT_HIGHLIGHT];
      const attrs = color ? {highlightColor: color} : null;
      tr = applyMark(tr.setSelection(state.selection), schema, markType, attrs);
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

export default TextHighlightCommand;
