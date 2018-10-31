// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/plugins/lists/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/commands/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import isListNode from './isListNode';
import joinListNode from './joinListNode';
import nullthrows from 'nullthrows';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {PARAGRAPH, HEADING, LIST_ITEM, ORDERED_LIST, BULLET_LIST} from './NodeNames';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';

function unwrapNodesFromList(
  tr: Transform,
  schema: Schema,
  listNodePos: number,
): Transform {
  const {nodes} = schema;
  const paragraph = nodes[PARAGRAPH];
  const list_item = nodes[LIST_ITEM];

  if (!list_item || !paragraph) {
    return tr;
  }

  if (!tr.doc || !tr.selection) {
    return tr;
  }

  const listNode = tr.doc.nodeAt(listNodePos);
  if (!isListNode(listNode)) {
    return tr;
  }
  const initialSelection = tr.selection;
  const contentBlocksBefore = [];
  const contentBlocksSelected = [];
  const contentBlocksAfter = [];
  const {from, to} = tr.selection;
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
  let selectionOffset = 0;

  if (contentBlocksAfter.length) {
    const nodes = contentBlocksAfter.map(block => {
      return list_item.create({}, Fragment.from(block.node));
    });
    const frag = Fragment.from(listNodeType.create(
      attrs,
      Fragment.from(nodes),
    ));
    tr = tr.insert(listNodePos, frag);
  }

  if (contentBlocksSelected.length) {
    const nodes = contentBlocksSelected.map(block => block.node);
    const frag = Fragment.from(nodes);
    tr = tr.insert(listNodePos, frag);
    selectionOffset -= 2;
  }

  if (contentBlocksBefore.length) {
    const nodes = contentBlocksBefore.map(block => {
      return list_item.create({}, Fragment.from(block.node));
    });
    const frag = Fragment.from(listNodeType.create(
      attrs,
      Fragment.from(nodes),
    ));
    tr = tr.insert(listNodePos, frag);
    selectionOffset += 2;
  }

  const selection = TextSelection.create(
    tr.doc,
    initialSelection.from + selectionOffset,
    initialSelection.to + selectionOffset,
  );

  tr = tr.setSelection(selection);

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
  const list_item = nodes[LIST_ITEM];

  if (!list_item || !paragraph) {
    return tr;
  }

  const node = tr.doc.nodeAt(pos);
  const initialSelection = tr.selection;
  const from = pos;
  const to = from + node.nodeSize;
  const attrs = {level: 1, start: 1};
  const paragraphNode = paragraph.create({}, node.content, node.marks);
  const listItemNode = list_item.create({}, Fragment.from(paragraphNode));
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
    initialSelection.from,
    initialSelection.to,
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
    if (listNodeType) {
      tr = tr.setNodeMarkup(
        pos,
        listNodeType,
        blockNode.attrs,
        blockNode.marks,
      );
      // tr = joinListNode(tr, schema, pos);
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

export default function toggleList(
  tr: Transform,
  schema: Schema,
  listNodeType: NodeType,
): Transform {

  const {nodes} = schema;
  const bullet_list = nodes[BULLET_LIST];
  const heading = nodes[HEADING];
  const list_item = nodes[LIST_ITEM];
  const ordered_list = nodes[ORDERED_LIST];
  const paragraph = nodes[PARAGRAPH];
  if (
    !bullet_list ||
    !ordered_list ||
    !list_item ||
    !heading ||
    !paragraph
  ) {
    return tr;
  }

  if (!tr.selection || !tr.doc) {
    return tr;
  }

  const blocksBetween = [];
  tr.doc.nodesBetween(tr.selection.from, tr.selection.to, (
    node,
    pos,
    parentNode,
    index,
  ) => {
    blocksBetween.push({
      node,
      pos,
      parentNode,
      index,
    });

    return false;
  });

  if (!blocksBetween.length) {
    return tr;
  }

  const validNodeTypes = new Set([
    bullet_list,
    heading,
    ordered_list,
    paragraph,
  ]);

  const hasInvalidNode = blocksBetween.some(m => {
    return !m.node || !validNodeTypes.has(m.node.type);
  });

  if (hasInvalidNode) {
    return tr;
  }

  let offset = 0;
  blocksBetween.forEach((memo, ii) => {
    const {node, pos} = memo;
    if (ii === 0) {
      if (isListNode(node)) {
        if (node.type === listNodeType) {
          listNodeType = null;
        }
      }
    }
    const pp = pos + offset;
    const sizeBefore = tr.doc.nodeSize;
    tr = setBlockListNodeType(
      tr,
      schema,
      listNodeType,
      pp,
    );
    const sizeAfter = tr.doc.nodeSize;
    offset += (sizeAfter - sizeBefore);
  });


  return tr;
}
