// @flow

import * as MarkNames from './MarkNames';
import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setTextAlign} from './TextAlignCommand';

const {
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_UNDERLINE,
  MARK_STRIKE,
} = MarkNames;

const FORMAT_MARK_NAMES = [
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_UNDERLINE,
  MARK_STRIKE,
];

function clearMarks(tr: Transform, schema: Schema): Transform {
  const {doc, selection} = tr;
  if (!selection || !doc) {
    return tr;
  }
  const {from, to, empty} = selection;
  if (empty) {
    return tr;
  }

  const markTypesToRemove =
    new Set(FORMAT_MARK_NAMES.map(n => schema.marks[n]).filter(Boolean));

  if (!markTypesToRemove.size) {
    return tr;
  }

  const tasks = [];
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.marks && node.marks.length) {
      node.marks.some(mark => {
        if (markTypesToRemove.has(mark.type)) {
          tasks.push({node, pos, mark});
        }
      });
      return true;
    }
    return true;
  });
  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {node, mark, pos} = job;
    tr = tr.removeMark(pos, pos + node.nodeSize, mark.type);
  });

  // It should also clear text alignment.
  tr = setTextAlign(tr, schema, null);
  return tr;
}

class MarksClearCommand extends UICommand {

  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (state: EditorState) => {
    const {selection} = state;
    return !selection.empty && (selection instanceof TextSelection);
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const tr = clearMarks(
      state.tr.setSelection(state.selection),
      state.schema,
    );
    if (dispatch && tr.docChanged) {
      dispatch(tr);
      return true;
    }
    return false;
  };
}

export default MarksClearCommand;
