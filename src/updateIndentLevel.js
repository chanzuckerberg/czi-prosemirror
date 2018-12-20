// @flow

import {AllSelection, TextSelection} from 'prosemirror-state';
import {BLOCKQUOTE, LIST_ITEM, HEADING, PARAGRAPH} from './NodeNames';
import {Fragment, Schema} from 'prosemirror-model';
import {MAX_INDENT_LEVEL, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';
import {Transform} from 'prosemirror-transform';
import clamp from './ui/clamp';
import compareNumber from './compareNumber';
import isListNode from './isListNode';
import transformAndPreserveTextSelection from './transformAndPreserveTextSelection';

export default function updateIndentLevel(
  tr: Transform,
  schema: Schema,
  delta: number,
): Transform {
  const {doc, selection} = tr;
  if (!doc || !selection) {
    return tr;
  }

  if (!(
    selection instanceof TextSelection ||
    selection instanceof AllSelection
  )) {
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

  // tr = transformAndPreserveTextSelection(tr, schema, (memo) => {
  //   let tr2 = memo.tr;
  //   listNodePoses.sort(compareNumber).reverse().forEach(pos => {
  //     tr2 = setListNodeIndent(
  //       tr2,
  //       memo.schema,
  //       pos,
  //       delta,
  //     );
  //   });
  //   return tr2;
  // });

  listNodePoses.sort(compareNumber).reverse().forEach(pos => {
    tr = transformAndPreserveTextSelection(tr, schema, (memo) => {
      return setListNodeIndent(
        memo.tr,
        memo.schema,
        pos,
        delta,
      );
    });
  });

  return tr;
}

function setListNodeIndent(
  tr: Transform,
  schema: Schema,
  pos: number,
  delta: number,
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
    MAX_INDENT_LEVEL,
  );
  if (indentNew === listNode.attrs.indent) {
    return tr;
  }

  const {from, to} = selection;
  
  if (from <= pos && to >= (pos + listNode.nodeSize)) {
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
        itemNode.marks,
      );
      if ((itemPos + itemNode.nodeSize) <= from) {
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
      Fragment.from(itemsAfter),
    );
    tr = tr.insert(pos, Fragment.from(listNodeNew));
    tr = mergeSiblingLists(tr, pos);
  }

  if (itemsSelected.length) {
    const listNodeAttrs = {
      ...listNode.attrs,
      indent: indentNew,
    };
    const listNodeNew = listNodeType.create(
      listNodeAttrs,
      Fragment.from(itemsSelected),
    );
    tr = tr.insert(pos, Fragment.from(listNodeNew));
    tr = mergeSiblingLists(tr, pos);
  }

  if (itemsBefore.length) {
    const listNodeNew = listNodeType.create(
      listNode.attrs,
      Fragment.from(itemsBefore),
    );
    tr = tr.insert(pos, Fragment.from(listNodeNew));
    tr = mergeSiblingLists(tr, pos);
  }
  return tr;
}

function mergeSiblingLists(
  tr: Transform,
  listNodePos: number,
): Transform {
  let listNode = tr.doc.nodeAt(listNodePos);
  if (!listNode) {
    return tr;
  }
  const listNodeType = listNode.type;
  const indent = listNode.attrs.indent;
  let fromPos = listNodePos;
  let toPos = listNodePos + listNode.nodeSize;
  let $fromPos = tr.doc.resolve(fromPos);
  let $toPos = tr.doc.resolve(toPos);
  if (
    $fromPos.nodeBefore &&
    $fromPos.nodeBefore.type === listNodeType &&
    $fromPos.nodeBefore.attrs.indent === indent
  ) {
    const beforeFromPos = fromPos - $fromPos.nodeBefore.nodeSize;
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos - 1, listNode.content);

    listNode = tr.doc.nodeAt(beforeFromPos);
    fromPos = beforeFromPos;
    toPos = beforeFromPos + listNode.nodeSize;
    $fromPos = tr.doc.resolve(fromPos);
    $toPos = tr.doc.resolve(toPos);
  }

  if (
    $toPos.nodeAfter &&
    $toPos.nodeAfter.type === listNodeType &&
    $toPos.nodeAfter.attrs.indent === indent
  ) {
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos + 1, listNode.content);
  }

  return tr;
}

function setNodeIndentMarkup(
  tr: Transform,
  schema: Schema,
  pos: number,
  delta: number,
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
