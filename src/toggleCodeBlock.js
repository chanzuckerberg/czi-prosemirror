// @flow

import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {CODE_BLOCK, PARAGRAPH, HEADING} from './NodeNames';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';
import {unwrapNodesFromList} from './toggleList';
import isTableNode from './isTableNode';

export default function toggleCodeBlock(
  tr: Transform,
  schema: Schema,
): Transform {

  const {nodes} = schema;
  const codeBlock = nodes[CODE_BLOCK];
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];

  if (!tr.selection || !tr.doc || !codeBlock) {
    return tr;
  }

  let allNodesAreTheSameHeadingLevel = true;
  const blocksBetween = [];
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
    heading,
    paragraph,
    codeBlock,
  ].filter(Boolean));

  const hasInvalidNode = blocksBetween.some(m => {
    return !m.node || !validNodeTypes.has(m.node.type);
  });

  if (hasInvalidNode) {
    return tr;
  }

  let offset = 0;
  let codeBlockEnabled = true;

  blocksBetween.forEach((memo, ii) => {
    const {node, pos} = memo;
    if (ii === 0 && node.type === codeBlock) {
      // If the very first node has the same type as the desired node type,
      // assume this is a toggle-off action.
      codeBlockEnabled = false;
    }
    const pp = pos + offset;
    const fromBefore = tr.selection.from;
    const sizeBefore = tr.doc.nodeSize;
    tr = setCodeBlockNodeEnabled(tr, schema, pp, codeBlockEnabled);
    const fromAfter = tr.selection.from;
    const sizeAfter = tr.doc.nodeSize;
    offset += (fromAfter - fromBefore);
    offset += (sizeAfter - sizeBefore);
  });

  return tr;
}

function setCodeBlockNodeEnabled(
  tr: Transform,
  schema: Schema,
  pos: number,
  enabled: boolean,
): Transform {
  const {nodes} = schema;
  const codeBlock = nodes[CODE_BLOCK];
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];
  const node = tr.doc.nodeAt(pos);
  if (!enabled && paragraph && node.type === codeBlock) {
    tr = tr.setNodeMarkup(
      pos,
      paragraph,
      {},
      node.marks,
    );
  } else if (enabled && codeBlock && node.type !== codeBlock) {
    tr = tr.setNodeMarkup(
      pos,
      codeBlock,
      {codeBlock},
      node.marks,
    );
  }
  return tr;
}
