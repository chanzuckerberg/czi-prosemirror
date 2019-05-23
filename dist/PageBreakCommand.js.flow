// @flow

import {Fragment, Schema} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import {PAGE_BREAK} from './NodeNames';
import UICommand from './ui/UICommand';

function insertPageBreak(tr: Transform, schema: Schema): Transform {
  const {selection} = tr;
  if (!selection) {
    return tr;
  }
  const {from, to} = selection;
  if (from !== to) {
    return tr;
  }

  const pageBreak = schema.nodes[PAGE_BREAK];
  if (!pageBreak) {
    return tr;
  }

  const node = pageBreak.create({}, null, null);
  const frag = Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

class PageBreakCommand extends UICommand {
  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView
  ): boolean => {
    const {selection, schema} = state;
    const tr = insertPageBreak(state.tr.setSelection(selection), schema);
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
}

export default PageBreakCommand;
