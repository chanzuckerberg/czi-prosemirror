// @flow

import clamp from './ui/clamp';
import compareNumber from './compareNumber';
import isListNode from './isListNode';
import nodeAt from './nodeAt';
import transformAndPreserveTextSelection from './transformAndPreserveTextSelection';
import {AllSelection, TextSelection} from 'prosemirror-state';
import {BLOCKQUOTE, HEADING, LIST_ITEM, PARAGRAPH} from './NodeNames';
import {Fragment, Schema} from 'prosemirror-model';
import {MAX_INDENT_LEVEL, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';
import {Node, NodeType} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

export default function updateIndentLevel(
  tr: Transform,
  schema: Schema,
  delta: number
): Transform {
  const {doc, selection} = tr;
  if (!doc || !selection) {
    return tr;
  }

  if (
    !(selection instanceof TextSelection || selection instanceof AllSelection)
  ) {
    return tr;
  }

  const {nodes} = schema;
  const {from, to} = selection;
  const listNodePoses = [];

  const blockquote = nodes[BLOCKQUOTE];
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    if (
      nodeType === paragraph ||
      nodeType === heading ||
      nodeType === blockquote
    ) {
      tr = setNodeIndentMarkup(tr, schema, pos, delta);
      return false;
    } else if (isListNode(node)) {
      // List is tricky, we'll handle it later.
      listNodePoses.push(pos);
      return false;
    }
    return true;
  });

  if (!listNodePoses.length) {
    return tr;
  }

  tr = transformAndPreserveTextSelection(tr, schema, memo => {
    const {schema} = memo;
    let tr2 = memo.tr;
    listNodePoses
      .sort(compareNumber)
      .reverse()
      .forEach(pos => {
        tr2 = setListNodeIndent(tr2, schema, pos, delta);
      });
    return tr2;
  });

  return tr;
}

function setListNodeIndent(
  tr: Transform,
  schema: Schema,
  pos: number,
  delta: number
): Transform {
  const listItem = schema.nodes[LIST_ITEM];
  if (!listItem) {
    return tr;
  }

  const {doc, selection} = tr;
  if (!doc) {
    return tr;
  }

  const listNode = doc.nodeAt(pos);
  if (!listNode) {
    return tr;
  }

  const indentNew = clamp(
    MIN_INDENT_LEVEL,
    listNode.attrs.indent + delta,
    MAX_INDENT_LEVEL
  );
  if (indentNew === listNode.attrs.indent) {
    return tr;
  }

  const {from, to} = selection;

  if (from <= pos && to >= pos + listNode.nodeSize) {
    return setNodeIndentMarkup(tr, schema, pos, delta);
  }

  const listNodeType = listNode.type;

  // listNode is partially selected.
  const itemsBefore = [];
  const itemsSelected = [];
  const itemsAfter = [];

  doc.nodesBetween(pos, pos + listNode.nodeSize, (itemNode, itemPos) => {
    if (itemNode.type === listNodeType) {
      return true;
    }

    if (itemNode.type === listItem) {
      const listItemNode = listItem.create(
        itemNode.attrs,
        itemNode.content,
        itemNode.marks
      );
      if (itemPos + itemNode.nodeSize <= from) {
        itemsBefore.push(listItemNode);
      } else if (itemPos > to) {
        itemsAfter.push(listItemNode);
      } else {
        itemsSelected.push(listItemNode);
      }
      return false;
    }

    return true;
  });

  tr = tr.delete(pos, pos + listNode.nodeSize);
  if (itemsAfter.length) {
    const listNodeNew = listNodeType.create(
      listNode.attrs,
      Fragment.from(itemsAfter)
    );
    tr = tr.insert(pos, Fragment.from(listNodeNew));
  }

  if (itemsSelected.length) {
    const listNodeAttrs = {
      ...listNode.attrs,
      indent: indentNew,
    };
    const listNodeNew = listNodeType.create(
      listNodeAttrs,
      Fragment.from(itemsSelected)
    );
    tr = tr.insert(pos, Fragment.from(listNodeNew));
  }

  if (itemsBefore.length) {
    const listNodeNew = listNodeType.create(
      listNode.attrs,
      Fragment.from(itemsBefore)
    );
    tr = tr.insert(pos, Fragment.from(listNodeNew));
  }

  return mergeListNodes(tr, schema, listNodeType, indentNew);
}

function setNodeIndentMarkup(
  tr: Transform,
  schema: Schema,
  pos: number,
  delta: number
): Transform {
  if (!tr.doc) {
    return tr;
  }
  const node = tr.doc.nodeAt(pos);
  if (!node) {
    return tr;
  }
  const indent = clamp(
    MIN_INDENT_LEVEL,
    (node.attrs.indent || 0) + delta,
    MAX_INDENT_LEVEL
  );
  if (indent === node.attrs.indent) {
    return tr;
  }
  const nodeAttrs = {
    ...node.attrs,
    indent,
  };
  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
}

// Merge sibling list nodes that have the same list type and indent level.
function mergeListNodes(
  tr: Transform,
  schema: Schema,
  listNodeType: NodeType,
  indent: number
): Transform {
  if (tr.getMeta('dryrun')) {
    // This transform is potentially expensive to perform, so skip it if
    // we're only doing it as "dryrun" to see whether user could update the
    // lists.
    return tr;
  }

  let working = true;
  while (working) {
    const from = 1;
    const to = tr.doc.nodeSize - 2;
    if (to <= from) {
      break;
    }
    let mergeInfo;
    tr.doc.nodesBetween(from, to, (node, pos) => {
      if (mergeInfo) {
        // We've found the list to merge. Stop traversing deeper.
        return false;
      }
      if (!isListNode(node)) {
        // This is not a list node, keep traversing deeper until we've found
        // one.
        return true;
      }

      if (node.type !== listNodeType && node.attrs.indent !== indent) {
        // This list node does matched the spec. Stop the traversing deeper.
        return false;
      }

      const nextSiblingNodePos = pos + node.nodeSize;
      const nextSiblingNode = nodeAt(tr.doc, nextSiblingNodePos);
      if (nextSiblingNode && areListNodesMergeable(node, nextSiblingNode)) {
        // The current list node and its next sibling list node can be merged.
        mergeInfo = {
          fromNode: node,
          toNode: nextSiblingNode,
          deleteFrom: nextSiblingNodePos,
          deleteTo: nextSiblingNodePos + nextSiblingNode.nodeSize,
          insertAt: nextSiblingNodePos - 1,
          content: nextSiblingNode.content,
        };
      }

      // Stop the traversing deeper inside the current list node which
      // can only contains inline nodes inside.
      return false;
    });

    if (mergeInfo) {
      // Merge list nodes.
      tr = tr.delete(mergeInfo.deleteFrom, mergeInfo.deleteTo);
      tr = tr.insert(mergeInfo.insertAt, mergeInfo.content);
      working = true;
    } else {
      working = false;
    }
  }
  return tr;
}

function areListNodesMergeable(one: Node, two: Node): boolean {
  return !!(
    one.type === two.type &&
    one.attrs.indent === two.attrs.indent &&
    isListNode(one) &&
    isListNode(two)
  );
}
