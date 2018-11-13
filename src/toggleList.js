// @flow

import isListNode from './isListNode';
import joinListNode from './joinListNode';
import nullthrows from 'nullthrows';
import updateNodesInSelection from './updateNodesInSelection';
import {PARAGRAPH, LIST_ITEM, ORDERED_LIST, BULLET_LIST} from './NodeNames';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';
import applyMark from './applyMark';
import {MARK_TEXT_SELECTION} from './MarkNames';

export default function toggleList(
  tr: Transform,
  schema: Schema,
  listNodeType: NodeType,
): Transform {

  let allNodesAreTheSameHeadingLevel = true;
  tr = updateNodesInSelection(
    tr,
    schema,
    (args) => {
      return setBlockListNodeType(
        args.tr,
        args.schema,
        listNodeType,
        args.pos,
      );
    },
    (args) => {
      const {node} = args;
      if (args.index === 0 && isListNode(node) && node.type === listNodeType) {
        // If the very first node has the same type as the desired node type,
        // assume this is a toggle-off action.
        listNodeType = null;
      }
      return true;
    },
  );
  return tr;
}

export function unwrapNodesFromList(
  tr: Transform,
  schema: Schema,
  listNodePos: number,
  unwrapParagraphNode?: ?(Node) => Node,
): Transform {
  if (!tr.doc || !tr.selection) {
    return tr;
  }

  const {nodes} = schema;
  const paragraph = nodes[PARAGRAPH];
  const listItem= nodes[LIST_ITEM];
  const markType = schema.marks[MARK_TEXT_SELECTION];

  if (!listItem|| !paragraph || !markType) {
    return tr;
  }

  const listNode = tr.doc.nodeAt(listNodePos);
  if (!isListNode(listNode)) {
    return tr;
  }

  const initialSelection = tr.selection;
  const {from, to} = initialSelection;

  if (from === to && from < 1) {
    return tr;
  }
  const contentBlocksBefore = [];
  const contentBlocksSelected = [];
  const contentBlocksAfter = [];

  // Mark current selection so that we could resume the selection later
  // after changing the whole list.
  let selectionExpanded = false;
  if (from === to) {
    // Selection is collapsed, create a temnporary selection that the marks can
    // be applied to.
    const selection = TextSelection.create(
      tr.doc,
      from - 1,
      to,
    );
    tr = tr.setSelection(selection);
    selectionExpanded = true;
  }

  tr = applyMark(tr, schema, markType, {});
  tr.doc.nodesBetween(listNodePos, listNodePos + listNode.nodeSize, (
    node,
    pos,
    parentNode,
    index,
  ) => {
    if (node.type !== paragraph) {
      return true;
    }
    const block = {
      node,
      pos,
      parentNode,
      index,
    };

    if ((pos + node.nodeSize) <= from) {
      contentBlocksBefore.push(block);
    } else if (pos > to) {
      contentBlocksAfter.push(block);
    } else {
      contentBlocksSelected.push(block);
    }
    return false;
  });

  if (!contentBlocksSelected.length) {
    return tr;
  }

  tr = tr.delete(listNodePos, listNodePos + listNode.nodeSize);

  const listNodeType = listNode.type;
  const attrs = {level: listNode.attrs.level, start: 1};

  if (contentBlocksAfter.length) {
    const nodes = contentBlocksAfter.map(block => {
      return listItem.create({}, Fragment.from(block.node));
    });
    const frag = Fragment.from(listNodeType.create(
      attrs,
      Fragment.from(nodes),
    ));
    tr = tr.insert(listNodePos, frag);
  }

  if (contentBlocksSelected.length) {
    const nodes = contentBlocksSelected.map(block => {
      if (unwrapParagraphNode) {
        return unwrapParagraphNode(block.node);
      } else {
        return block.node;
      }
    });
    const frag = Fragment.from(nodes);
    tr = tr.insert(listNodePos, frag);
  }

  if (contentBlocksBefore.length) {
    const nodes = contentBlocksBefore.map(block => {
      return listItem.create({}, Fragment.from(block.node));
    });
    const frag = Fragment.from(listNodeType.create(
      attrs,
      Fragment.from(nodes),
    ));
    tr = tr.insert(listNodePos, frag);
  }

  const markFinder = mark => mark.type === markType;
  let markFrom = null;
  let markTo = null;
  tr.doc.nodesBetween(
    Math.max(1, from - 4),
    Math.min(to + 4, tr.doc.nodeSize - 2),
    (node, pos) => {
      if (node.marks && node.marks.find(markFinder)) {
        markFrom = markFrom || pos;
        markTo = pos + node.nodeSize;
      }
      return true;
    },
  );

  if (markFrom !== null && markTo !== null) {
    tr = tr.removeMark(markFrom, markTo, markType);
    const selection = TextSelection.create(
      tr.doc,
      markFrom + (selectionExpanded ? 1 : 0),
      markTo,
    );
    tr = tr.setSelection(selection);
  }

  return tr;
}

function wrapNodeWithList(
  tr: Transform,
  schema: Schema,
  pos: number,
  listNodeType: NodeType,
): Transform {
  if (!tr.doc || !listNodeType) {
    return tr;
  }

  const {nodes} = schema;
  const paragraph = nodes[PARAGRAPH];
  const listItem= nodes[LIST_ITEM];

  if (!listItem|| !paragraph) {
    return tr;
  }

  const node = tr.doc.nodeAt(pos);
  const initialSelection = tr.selection;
  const from = pos;
  const to = from + node.nodeSize;
  const attrs = {level: 1, start: 1};
  const paragraphNode = paragraph.create({}, node.content, node.marks);
  const listItemNode = listItem.create({}, Fragment.from(paragraphNode));
  const listNode = listNodeType.create(attrs, Fragment.from(listItemNode));

  tr = tr.delete(from, to);
  tr = tr.insert(from, Fragment.from(listNode));
  tr = tr.setSelection(TextSelection.create(
    tr.doc,
    from,
    to,
  ));
  tr = joinListNode(tr, schema, from);

  const selection = TextSelection.create(
    tr.doc,
    initialSelection.from + 2,
    initialSelection.to + 2,
  );

  tr = tr.setSelection(selection);
  return tr;
}

function setBlockListNodeType(
  tr: Transform,
  schema: Schema,
  listNodeType: ?NodeType,
  pos: number,
): Transform {
  if (!tr.doc) {
    return tr;
  }
  const blockNode = tr.doc.nodeAt(pos);
  if (!blockNode || !blockNode.isBlock) {
    return tr;
  }
  if (isListNode(blockNode)) {
    if (listNodeType && blockNode.type !== listNodeType) {
      tr = tr.setNodeMarkup(
        pos,
        listNodeType,
        blockNode.attrs,
        blockNode.marks,
      );
    } else {
      tr = unwrapNodesFromList(tr, schema, pos);
    }
  } else {
    if (listNodeType) {
      tr = wrapNodeWithList(tr, schema, pos, listNodeType);
    }
  }

  return tr;
}
