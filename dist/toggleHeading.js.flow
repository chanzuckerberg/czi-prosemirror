// @flow

import isInsideListItem from './isInsideListItem';
import isListNode from './isListNode';
import {BLOCKQUOTE, PARAGRAPH, HEADING, LIST_ITEM} from './NodeNames';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {unwrapNodesFromList} from './toggleList';

export default function toggleHeading(
  tr: Transform,
  schema: Schema,
  level: number,
): Transform {
  const {nodes} = schema;
  const {selection, doc} = tr;

  const blockquote = nodes[BLOCKQUOTE];
  const heading = nodes[HEADING];
  const listItem = nodes[LIST_ITEM];
  const paragraph = nodes[PARAGRAPH];

  if (
    !selection || !doc || !heading || !paragraph ||
    !listItem || !blockquote
  ) {
    return tr;
  }

  const {from, to} = tr.selection;
  let startWithHeadingBlock = null;
  const poses = [];
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
  const blockquote = nodes[BLOCKQUOTE];
  if (pos >= tr.doc.content.size) {
    // Workaround to handle the edge case that pos was shifted caused by `toggleList`.
    return tr;
  }
  const node = tr.doc.nodeAt(pos);
  if (!node || !heading || !paragraph || !blockquote) {
    return tr;
  }
  const nodeType = node.type;
  if (isInsideListItem(tr.doc, pos)) {
    return tr;
  } else if (isListNode(node)) {
    // Toggle list
    if (heading && level !== null) {
      tr = unwrapNodesFromList(tr, schema, pos, (paragraphNode) => {
        const {content, marks, attrs} = paragraphNode;
        const headingAttrs = {...attrs, level};
        return heading.create(headingAttrs, content, marks);
      });
    }
  } else if (nodeType === heading) {
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
  } else if (level && nodeType === paragraph || nodeType === blockquote) {
    tr = tr.setNodeMarkup(
      pos,
      heading,
      {...node.attrs, level},
      node.marks,
    );
  }
  return tr;
}
