// @flow

import LinkURLEditor from './ui/LinkURLEditor';
import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import findNodesWithSameMark from './findNodesWithSameMark';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_LINK} from './MarkNames';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {showSelectionPlaceholder, hideSelectionPlaceholder} from './SelectionPlaceholderPlugin';

class LinkSetURLCommand extends UICommand {

  _popUp = null;

  isEnabled = (state: EditorState): boolean => {
    if (!(state.selection instanceof TextSelection)) {
      // Could be a NodeSelection or CellSelection.
      return false;
    }

    const markType = state.schema.marks[MARK_LINK];
    if (!markType) {
      return false;
    }
    const {from, to} = state.selection;
    return from < to;
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent,
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(undefined);
    }

    if (dispatch) {
      dispatch(showSelectionPlaceholder(state));
    }

    const {doc, schema, selection} = state;
    const markType = schema.marks[MARK_LINK];
    if (!markType) {
      return Promise.resolve(undefined);
    }
    const {from, to} = selection;
    const result = findNodesWithSameMark(doc, from, to, markType);
    const href = result ? result.mark.attrs.href : null;
    return new Promise(resolve => {
      this._popUp = createPopUp(LinkURLEditor, {href}, {
        modal: true,
        onClose: (val) => {
          if (this._popUp) {
            this._popUp = null;
            resolve(val);
          }
        }
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    href: ?string,
  ): boolean => {
    if (dispatch) {
      let {tr, selection, schema} = state;
      tr = view ? hideSelectionPlaceholder(view.state) : tr;
      tr = tr.setSelection(selection);
      if (href !== undefined) {
        const markType = schema.marks[MARK_LINK];
        const attrs = href ? {href} : null;
        tr = applyMark(
          tr.setSelection(state.selection),
          schema,
          markType,
          attrs,
        );
      }
      dispatch(tr);
    }
    view && view.focus();
    return true;
  };
}

export default LinkSetURLCommand;
