// @flow

import applyMark from './applyMark';
import clamp from './ui/clamp';
import isListNode from './isListNode';
import updateListNodeIndentLevel from './updateListNodeIndentLevel';
import {BULLET_LIST, ORDERED_LIST, LIST_ITEM, HEADING, PARAGRAPH} from './NodeNames';
import {Fragment, Schema, NodeType, ResolvedPos, Slice} from 'prosemirror-model';
import {MARK_TEXT_SELECTION} from './MarkNames';
import {MAX_INDENT_LEVEL} from './updateListNodeIndentLevel';
import {Node} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform, Step, StepResult} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

export default function updateIndentLevel(
  tr: Transform,
  schema: Schema,
  delta: number,
): Transform {
  const {doc, selection} = tr;
  if (!doc || !selection) {
    return tr;
  }

  if (!(selection instanceof TextSelection)) {
    return tr;
  }

  const {nodes} = schema;
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];

  const {from, to} = selection;
  const listNodes = [];
  const listNodeToPos = new Map();

  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    if (nodeType === paragraph) {
      tr = setNodeIndentMarkup(tr, pos, node, delta);
      return false;
    } else if (nodeType === heading) {
      tr = setNodeIndentMarkup(tr, pos, node, delta);
      return false;
    } else if (isListNode(node)) {
      if (pos >= from && (pos + node.nodeSize) <= to) {
        tr = setNodeIndentMarkup(tr, pos, node, delta);
      } else {
        // List is only partially selected, we'll handle it later.
        listNodes.push(node);
        listNodeToPos.set(node, pos);
      }
      return false;
    }
    return true;
  });


  if (!listNodes.length) {
    return tr;
  }

  listNodes.forEach(node => {
    console.log(listNodeToPos.get(node));
  });

  // listNodes.sort((a, b) => {
  //
  // });
  return tr;
}

function setNodeIndentMarkup(
  tr: Transform,
  pos: number,
  node: Node,
  delta: number,
): Transform {
  const indent = clamp(
    0,
    (node.attrs.indent || 0) + delta,
    MAX_INDENT_LEVEL,
  );
  if (indent === node.attrs.indent) {
    return tr;
  }
  const nodeAttrs = {
    ...node.attrs,
    indent,
  };
  return tr.setNodeMarkup(
    pos,
    node.type,
    nodeAttrs,
    node.marks,
  );
}


/*

  const markType = schema.marks[MARK_TEXT_SELECTION];
  if (!markType) {
    return tr;
  }

  // Annotate these list nodes.
  listNodes.forEach((node, ii) => {
    const pos = listNodeToPos.get(node);
    const nodeID = {ii}; // this is an uniqueID.
    const nodeAttrs = {...node.attrs, id: nodeID};
    tr = tr.setNodeMarkup(
      pos,
      node.type,
      nodeAttrs,
      node.marks,
    );
    listNodes[ii] = tr.doc.nodeAt(pos);
  });

  const listItem = nodes[LIST_ITEM];

  const markID = {}; // this is an uniqueID.
  const findMark = mark => mark.attrs.id === markID;
  tr = applyMark(tr, schema, markType, {id: markID});

  listNodes.forEach(listNode => {
    const listNodeType = listNode.type;
    const listNodeID = listNode.attrs.id;
    let fromPos = null;
    let toPos = null;
    let listNodePos = null;
    tr.doc.descendants((node, pos, parentNode) => {
      if (node.attrs.id === listNodeID) {
        listNodePos = pos;
      } else if (
        listNodePos !== null &&
        parentNode.type === paragraph &&
        node.marks &&
        node.marks.find(findMark)
      ) {
        fromPos = fromPos === null ? pos : fromPos;
        toPos = pos + node.nodeSize;
        return false;
      }
      return true;
    });
    if (listNodePos == null || fromPos === null || toPos === null) {
      return;
    }
    tr = tr.setNodeMarkup(
      listNodePos,
      listNode.type,
      {...listNode.attrs, id: null},
      listNode.marks,
    );
    tr = tr.setSelection(TextSelection.create(
      tr.doc,
      fromPos,
      toPos,
    ));
    tr = applyMark(tr, schema, markType, null);
    // tr = updateListNodeIndentLevel(tr, schema, delta);
    // break

    // tr = updateListNodeIndentLevel(tr, schema, delta);
  });
*/
