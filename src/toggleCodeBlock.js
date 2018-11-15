// @flow

import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import transformAndPreserveTextSelection from './transformAndPreserveTextSelection';
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
  const {selection, doc} = tr;
  const codeBlock = nodes[CODE_BLOCK];
  const paragraph = nodes[PARAGRAPH];
  if (!selection || !doc || !codeBlock || !paragraph) {
    return tr;
  }

  const poses = [];
  const {from, to} = tr.selection;
  let startWithCodeBlock = null;
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    if (startWithCodeBlock === null) {
      startWithCodeBlock = nodeType === codeBlock;
    }
    poses.push(pos);
    return !isListNode(node);
  });

  poses.sort();
  poses.reverse();
  poses.forEach(pos => {
    tr = setCodeBlockNodeEnabled(
      tr,
      schema,
      pos,
      startWithCodeBlock ? false : true,
    );
  });
  return tr;
}

function setCodeBlockNodeEnabled(
  tr: Transform,
  schema: Schema,
  pos: number,
  enabled: boolean,
): Transform {
  const {doc} = tr;
  if (!doc) {
    return tr;
  }

  const node = doc.nodeAt(pos);
  if (!node) {
    return;
  }
  if (isListNode(node)) {
    return tr;
  }

  const {nodes} = schema;
  const codeBlock = nodes[CODE_BLOCK];
  const paragraph = nodes[PARAGRAPH];
  if (!enabled && paragraph && node.type === codeBlock) {
    tr = tr.setNodeMarkup(
      pos,
      paragraph,
      node.attrs,
      node.marks,
    );
  } else if (enabled && codeBlock && node.type === paragraph) {
    tr = tr.setNodeMarkup(
      pos,
      codeBlock,
      node.attrs,
      node.marks,
    );
  }
  return tr;
}
