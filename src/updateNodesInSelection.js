// @flow

import isTableNode from './isTableNode';
import {CODE_BLOCK, PARAGRAPH, HEADING, LIST_ITEM, ORDERED_LIST, BULLET_LIST} from './NodeNames';
import {Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

type UpdateArgs = {
  index: number,
  node: Node,
  parentNode: Node,
  pos: number,
  schema: Schema,
  tr: Transform,
};

export default function updateNodesInSelection(
  tr: Transform,
  schema: Schema,
  update: (args: UpdateArgs) => ?Transform,
  filter: ?(args: UpdateArgs) => boolean,
): Transform {
  if (!tr.selection || !tr.doc) {
    return tr;
  }

  const {selection} = tr;
  if (!(selection instanceof TextSelection)) {
    // The selection could be a CellSelection, which should be left for
    // dedicated handler.
    // TODO: Try to support formating across multiple cells.
    return tr;
  }

  const nodesBetween = [];
  tr.doc.nodesBetween(tr.selection.from, tr.selection.to, (
    node,
    pos,
    parentNode,
    index,
  ) => {
    const {type, attrs} = node;
    if (isTableNode(node)) {
      // It's a table node, look into its cell content.
      return true;
    }

    const args = {
      index,
      node,
      parentNode,
      pos,
      schema,
      tr,
    };

    if (filter && !filter(args)) {
      return false;
    }
    nodesBetween.push(args);
    return false;
  });

  if (!nodesBetween.length) {
    return tr;
  }

  const {nodes} = schema;
  const bulletList = nodes[BULLET_LIST];
  const heading = nodes[HEADING];
  const orderedList = nodes[ORDERED_LIST];
  const paragraph = nodes[PARAGRAPH];
  const codeBlock = nodes[CODE_BLOCK];

  const validNodeTypes = new Set([
    bulletList,
    codeBlock,
    heading,
    orderedList,
    paragraph,
  ].filter(Boolean));

  const hasInvalidNode = nodesBetween.some(m => {
    return !m.node || !validNodeTypes.has(m.node.type);
  });

  if (hasInvalidNode) {
    return tr;
  }

  let offset = 0;

  nodesBetween.forEach((memo, index) => {
    const {node, pos, parentNode} = memo;
    const fromBefore = tr.selection.from;
    const sizeBefore = tr.doc.nodeSize;
    const args = {
      index,
      node,
      parentNode,
      pos: pos + offset,
      schema,
      tr,
    };
    const nextTr = update(args);
    if (nextTr) {
      tr = nextTr;
    }
    if (tr.docChanged) {
      const fromAfter = tr.selection.from;
      const sizeAfter = tr.doc.nodeSize;
      offset += (fromAfter - fromBefore);
      offset += (sizeAfter - sizeBefore);
    }
  });

  return tr;
}
