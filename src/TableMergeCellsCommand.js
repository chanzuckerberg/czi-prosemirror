// @flow

import {Schema} from 'prosemirror-model';
import {Node} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {CellSelection, mergeCells} from 'prosemirror-tables';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import {PARAGRAPH, TABLE_CELL, TEXT} from './NodeNames';
import UICommand from './ui/UICommand';

function isBlankParagraphNode(node: ?Node): boolean {
  if (!node) {
    return false;
  }
  if (node.type.name !== PARAGRAPH) {
    return false;
  }
  const {firstChild, lastChild} = node;
  if (!firstChild) {
    return true;
  }
  if (firstChild !== lastChild) {
    return false;
  }
  return firstChild.type.name === TEXT && firstChild.text === ' ';
}

function purgeConsecutiveBlankParagraphNodes(
  tr: Transform,
  schema: Schema,
): Transform {
  const paragraph = schema.nodes[PARAGRAPH];
  const cell = schema.nodes[TABLE_CELL];
  if (!paragraph || !cell) {
    return tr;
  }
  const {doc, selection} = tr;
  if (!selection instanceof CellSelection) {
    return tr;
  }
  const {from, to} = selection;
  const paragraphPoses = [];
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    if (node.type === paragraph && parentNode.type === cell) {
      if (isBlankParagraphNode(node)) {
        const $pos = tr.doc.resolve(pos);
        if (isBlankParagraphNode($pos.nodeBefore)) {
          paragraphPoses.push(pos);
        }
      }
      return false;
    } else {
      return true;
    }
  });
  paragraphPoses.reverse().forEach(pos => {
    const cell = tr.doc.nodeAt(pos);
    tr = tr.delete(pos, pos + cell.nodeSize);
  });
  return tr;
}

class TableMergeCellsCommand extends UICommand {
   execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {tr, schema, selection} = state;
    let endTr = tr;
    if (selection instanceof CellSelection) {
      mergeCells(state, (nextTr) => {
        endTr = nextTr;
      }, view);
      // Also cmerge onsecutive blank paragraphs into one.
      endTr = purgeConsecutiveBlankParagraphNodes(endTr, schema);
    }
    const changed = endTr.docChanged || (endTr !== tr);
    changed && dispatch && dispatch(endTr);
    return changed;
  }
}

export default TableMergeCellsCommand;
