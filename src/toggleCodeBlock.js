// @flow

import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import updateNodesInSelection from './updateNodesInSelection';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {PARAGRAPH, CODE_BLOCK} from './NodeNames';
import {Selection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';

export default function toggleCodeBlock(
  tr: Transform,
  schema: Schema,
): Transform {
  const {nodes} = schema;

  const codeBlock = nodes[CODE_BLOCK];
  const paragraph = nodes[PARAGRAPH];

  if (!tr.selection || !tr.doc || !codeBlock) {
    return tr;
  }

  let enabledDefault = undefined;
  tr = updateNodesInSelection(
    tr,
    schema,
    (args) => {
      const enabled = enabledDefault === undefined ?
        args.node.type !== codeBlock :
        enabledDefault;
      return setCodeBlockNodeEnabled(args.tr, args.schema, args.pos, enabled);
    },
    (args) => {
      if (args.index === 0 && args.node.type === codeBlock) {
        // If the very first node has the same type as the desired node type,
        // assume this is a toggle-off action.
        enabledDefault = false;
      }
      return true;
    },
  );
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
      {},
      node.marks,
    );
  }
  return tr;
}
