// @flow

import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import {PARAGRAPH, HEADING, LIST_ITEM} from './NodeNames';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';
import {unwrapNodesFromList} from './toggleList';

export default function toggleHeading(
  tr: Transform,
  schema: Schema,
  level: number,
): Transform {
  const {nodes} = schema;
  const {selection, doc} = tr;
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];
  const listItem = nodes[LIST_ITEM];

  if (!selection || !doc || !heading || !paragraph || !listItem) {
    return tr;
  }

  const {from, to} = tr.selection;
  let startWithHeadingBlock = null;
  const poses = [];
  const docType = doc.type;
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    const parentNodeType = parentNode.type;

    if (startWithHeadingBlock === null) {
      startWithHeadingBlock =
        nodeType === heading &&
        node.attrs.level === level;
    }

    if (parentNodeType !== listItem) {
      poses.push(pos);
    }
    return !isListNode(node);
  });
  // Update from the bottom to avoid disruptive changes in pos.
  poses.sort().reverse().forEach(pos => {
    tr = setHeadingNode(
      tr,
      schema,
      pos,
      startWithHeadingBlock ? null : level,
    );
  });
  return tr;
}

function setHeadingNode(
  tr: Transform,
  schema: Schema,
  pos: number,
  level: ?number,
): Transform {
  const {nodes} = schema;
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];
  const node = tr.doc.nodeAt(pos);
  if (!node || !heading || !paragraph) {
    return tr;
  }
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
      tr = tr.setNodeMarkup(
        pos,
        paragraph,
        node.attrs,
        node.marks,
      );
    } else {
      tr = tr.setNodeMarkup(
        pos,
        heading,
        {...node.attrs, level},
        node.marks,
      );
    }
  } else if (level && node.type === paragraph) {
    tr = tr.setNodeMarkup(
      pos,
      heading,
      {...node.attrs, level},
      node.marks,
    );
  }
  return tr;
}
