// @flow

import applyMark from './applyMark';
import isListNode from './isListNode';
import joinListNode from './joinListNode';
import nullthrows from 'nullthrows';
import updateNodesInSelection from './updateNodesInSelection';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {MARK_TEXT_SELECTION} from './MarkNames';
import {PARAGRAPH, LIST_ITEM, ORDERED_LIST, BULLET_LIST, TABLE, HEADING} from './NodeNames';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';
import keepSelection from './keepSelection';

import type {SelectionMemo} from './keepSelection';

export default function toggleList(
  tr: Transform,
  schema: Schema,
  listNodeType: NodeType,
): Transform {
  const {selection, doc} = tr;
  if (!selection || !doc) {
    return tr;
  }

  const {from, to} = selection;
  const fromSelection = TextSelection.create(
    doc,
    from,
    from,
  );
  const result = findParentNodeOfType(listNodeType)(fromSelection);
  if (result) {
    tr = unwrapNodesFromList(tr, schema, result.pos);
  } else {
    wrapNodesWithList(tr, schema, listNodeType);
  }

  return tr;
}

export function unwrapNodesFromList(
  tr: Transform,
  schema: Schema,
  listNodePos: number,
  unwrapParagraphNode?: ?(Node) => Node,
): Transform {
  return keepSelection(tr, schema, (memo) => {
    return unwrapNodesFromListInternal(
      memo,
      listNodePos,
      unwrapParagraphNode
    );
  });
}

function wrapNodesWithList(
  tr: Transform,
  schema: Schema,
  listNodeType: NodeType,
): Transform {
  return keepSelection(tr, schema, (memo) => {
    return wrapNodesWithListInternal(memo, listNodeType);
  });
}

function wrapNodesWithListInternal(
  memo: SelectionMemo,
  listNodeType: NodeType,
): Transform {
  const {schema} = memo;
  let {tr} = memo;
  const {doc, selection} = tr;
  if (!tr || !selection) {
    return tr;
  }
  const {from, to} = selection;

  const listItem = schema.nodes[LIST_ITEM];
  const paragraph = schema.nodes[PARAGRAPH];
  const heading = schema.nodes[HEADING];

  // const heading = schema.nodes[HEADING];
  const pNodes = [];
  const nodePos = new Map();
  const prevSiblings = new Map();
  let items = null;
  const lists = [];
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    const nodeName = nodeType.name;
    if (isListNode(node)) {
      if (node.type !== listNodeType) {
        tr = tr.setNodeMarkup(pos, listNodeType, node.attrs, node.marks);
      }
      items && lists.push(items);
      items = null;
      return false;
    }


    if (/table/.test(nodeName)){
      items && lists.push(items);
      items = null;
      return true;
    }

    if (nodeType === heading) {
      tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
      items = items || [];
      items.push({node, pos});
    } else if (nodeType === paragraph) {
      items = items || [];
      items.push({node, pos});
    } else {
      items && lists.push(items);
      items = null;
    }

    // if (node.type !== paragraph) {
    //   tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
    // }
    // const attrs = {
    //   ...node.attrs,
    //   __id: 123,
    // };
    // tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
    // group = group || [];
    // group.push({node, pos});

    // if (nodeType === LIST_ITEM) {
    //   return false;
    // } else if (nodeType !== PARAGRAPH) {
    //   const paragraphNode = paragraph.create(node.attrs, node.content, node.marks);
    //   const listItemNode = listItem.create({}, Fragment.from(paragraphNode));
    //   tr = tr.setNodeMarkup(pos, LIST_ITEM, listItemNode.attrs, listItemNode.marks);
    // } else if (nodeType === PARAGRAPH) {
    //   const paragraphSlice = tr.doc.slice(pos, pos + node.nodeSize);
    //   const listItemNode = listItem.create({}, Fragment.from(paragraphSlice));
    //   tr = tr.setNodeMarkup(pos, LIST_ITEM, listItemNode.attrs, listItemNode.marks);
    // }
      // const nextNodePos = pos + node.nodeSize;
      // const nextNode = nextNodePos  < tr.doc.nodeSize - 2 ?
      //   tr.doc.nodeAt(nextNodePos) :
      //   null;
      //
      // const nodeName = node.type.name;
      // if (nodeName === PARAGRAPH || nodeName === HEADING)
      //
      // // console.log(node.type.name, nextNode && nextNode.type.name);
      // console.log(node.isBlock, node.type.name);
    return false;
  });
  items && lists.push(items);

  // while (pNodes.length) {
  //   const node = pNodes.shift();
  //   const pos = nodePos.get(node);
  //
  //
  // }

  // lists.forEach((items) => {
  //   tr = keepSelection(tr, schema, (tr2) => {
  //
  //
  //
  //   });
  // });

  lists.forEach(paragraphNodes => {
    tr = wrapParagraphNodesWithList(
      tr,
      schema,
      listNodeType,
      memo,
    );
  });

  // console.log(lists);
  return tr;
}

function wrapParagraphNodesWithList(
  tr: Transform,
  schema: Schema,
  listNodeType: NodeType,
  memo: SelectionMemo,
): Transform {
  return tr;
}

function unwrapNodesFromListInternal(
  memo: SelectionMemo,
  listNodePos: number,
  unwrapParagraphNode?: ?(Node) => Node,
): Transform {
  const {schema} = memo;
  let {tr} = memo;

  if (!tr.doc || !tr.selection) {
    return tr;
  }

  const {nodes} = schema;
  const paragraph = nodes[PARAGRAPH];
  const listItem= nodes[LIST_ITEM];

  if (!listItem|| !paragraph) {
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
  return tr;
}

function getAlterListNodeType(
  schema: Schema,
  listNodeType: NodeType,
): ?NodeType {
  if (listNodeType.name === ORDERED_LIST) {
    return schema.nodes[BULLET_LIST];
  } else if (listNodeType.name === BULLET_LIST ) {
    return schema.nodes[ORDERED_LIST];
  }
  return null;
}
