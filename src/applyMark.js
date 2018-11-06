// @flow

import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import updateNodesInSelection from './updateNodesInSelection';
import {PARAGRAPH, HEADING} from './NodeNames';
import {Fragment, Schema, Node, NodeType, Mark} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';
import {unwrapNodesFromList} from './toggleList';


function markApplies(doc, ranges, type) {
  for (let i = 0; i < ranges.length; i++) {
    let {$from, $to} = ranges[i]
    let can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false
      can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) return true
  }
  return false
}

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
export default function applyMark(
  tr: Transform,
  schema: Schema,
  markType: Mark,
  attrs: Object,
): Transform {
  if (!tr.selection || !tr.doc || !markType) {
    return tr;
  }
  const {empty, $cursor, ranges} = tr.selection;
  if ((empty && !$cursor) || !markApplies(tr.doc, ranges, markType)) {
    return tr;
  }

  if ($cursor) {
    // tr = tr.removeStoredMark(markType);
    return tr.addStoredMark(markType.create(attrs));
  }

  let has = false;
  for (let i = 0; !has && i < ranges.length; i++) {
    let {$from, $to} = ranges[i]
    has = tr.doc.rangeHasMark($from.pos, $to.pos, markType);
  }
  for (let i = 0; i < ranges.length; i++) {
    let {$from, $to} = ranges[i]
    if (has) {
      // tr = tr.removeMark($from.pos, $to.pos, markType);
    }
    tr = tr.addMark($from.pos, $to.pos, markType.create(attrs));
  }

  return tr;
}

/*
  return function(state, dispatch) {
    let {empty, $cursor, ranges} = state.selection
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) return false
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks()))
          dispatch(state.tr.removeStoredMark(markType))
        else
          dispatch(state.tr.addStoredMark(markType.create(attrs)))
      } else {
        let has = false, tr = state.tr
        for (let i = 0; !has && i < ranges.length; i++) {
          let {$from, $to} = ranges[i]
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType)
        }
        for (let i = 0; i < ranges.length; i++) {
          let {$from, $to} = ranges[i]
          if (has) tr.removeMark($from.pos, $to.pos, markType)
          else tr.addMark($from.pos, $to.pos, markType.create(attrs))
        }
        dispatch(tr.scrollIntoView())
      }
    }
    return true
  }
}
*/
