// @flow

import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import updateNodesInSelection from './updateNodesInSelection';
import {PARAGRAPH, HEADING} from './NodeNames';
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

  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];

  if (!tr.selection || !tr.doc || !heading) {
    return tr;
  }

  let effectiveLevel = level;
  tr = updateNodesInSelection(
    tr,
    schema,
    (args) => {
      return setBlockHeadingNodeType(
        args.tr,
        args.schema,
        args.pos,
        effectiveLevel,
      );
    },
    (args) => {
      const {type, attrs} = args.node;
      if (args.index === 0 && type === heading &&  attrs.level === level) {
        // If the very first node has the same type as the desired node type,
        // assume this is a toggle-off action.
        effectiveLevel = null;
      }
      return true;
    },
  );
  return tr;
}

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
  if (!node) {
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
  } else if (heading && paragraph && level && node.type !== heading) {
    tr = tr.setNodeMarkup(
      pos,
      heading,
      {level},
      node.marks,
    );
  }
  return tr;
}
