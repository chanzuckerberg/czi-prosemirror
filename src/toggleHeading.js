// @flow

import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {PARAGRAPH, HEADING, LIST_ITEM, ORDERED_LIST, BULLET_LIST, TABLE} from './NodeNames';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';
import {unwrapNodesFromList} from './toggleList';

function setBlockHeadingNodeType(
  tr: Transform,
  schema: Schema,
  pos: number,
  level: ?number,
): Transform {
  const {nodes} = schema;
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];
  const node = tr.doc.nodeAt(pos);
  if (isListNode(node)) {
    // Toggle list
    if (heading && level !== null) {
      tr = unwrapNodesFromList(tr, schema, pos, (paragraphNode) => {
        const {content, marks} = paragraphNode;
        return heading.create({level}, content, marks);
      });
    }
  } else if (node.type === heading) {
    // Toggle heading
    if (level === null) {
      if (paragraph) {
        tr = tr.setNodeMarkup(
          pos,
          paragraph,
          {},
          node.marks,
        );
      }
    } else {
      if (heading) {
        tr = tr.setNodeMarkup(
          pos,
          heading,
          {level},
          node.marks,
        );
      }
    }
  } else if (heading && paragraph && level && node.type === paragraph) {
    tr = tr.setNodeMarkup(
      pos,
      heading,
      {level},
      node.marks,
    );
  }
  return tr;
}

export default function toggleHeading(
  tr: Transform,
  schema: Schema,
  level: number,
): Transform {
  const {nodes} = schema;
  const heading = nodes[HEADING];
  const listItem= nodes[LIST_ITEM];
  const orderedList = nodes[ORDERED_LIST];
  const paragraph = nodes[PARAGRAPH];
  const bulletList = nodes[BULLET_LIST];
  const table = nodes[TABLE];

  if (!tr.selection || !tr.doc || !heading) {
    return tr;
  }

  let areAllNodestheSameHeadingLevel = true;
  const blocksBetween = [];
  tr.doc.nodesBetween(tr.selection.from, tr.selection.to, (
    node,
    pos,
    parentNode,
    index,
  ) => {
    if (node.type !== heading || node.attrs.level !== level) {
      areAllNodestheSameHeadingLevel = false;
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
    bulletList,
    heading,
    orderedList,
    paragraph,
  ]);

  const hasInvalidNode = blocksBetween.some(m => {
    return !m.node || !validNodeTypes.has(m.node.type);
  });

  if (hasInvalidNode) {
    return tr;
  }

  const effectiveLevel = areAllNodestheSameHeadingLevel ? null : level;
  let offset = 0;

  blocksBetween.forEach((memo, ii) => {
    const {node, pos} = memo;

    const pp = pos + offset;
    const fromBefore = tr.selection.from;
    const sizeBefore = tr.doc.nodeSize;
    tr = setBlockHeadingNodeType(tr, schema, pp, effectiveLevel);
    const fromAfter = tr.selection.from;
    const sizeAfter = tr.doc.nodeSize;
    offset += (fromAfter - fromBefore);
    offset += (sizeAfter - sizeBefore);
  });

  return tr;
}
