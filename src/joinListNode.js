// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/plugins/lists/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/commands/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import joinDown from './joinDown';
import joinUp from './joinUp';
import isListNode from './isListNode';
import nullthrows from 'nullthrows';
import {Fragment, Schema, Node, NodeType, ResolvedPos} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {setBlockType} from 'prosemirror-commands';

export default function joinListNode(
  tr: Transform,
  schema: Schema,
  listNodePos: number,
): Transform {
  if (!tr.doc || !tr.selection) {
    return tr;
  }
  const node = tr.doc.nodeAt(listNodePos);
  if (!isListNode(node)) {
    return tr;
  }
  const initialSelection = tr.selection;
  const listFromPos = listNodePos;
  const listToPos = listFromPos + node.nodeSize;
  const $fromPos = tr.doc.resolve(listFromPos);
  const $toPos = tr.doc.resolve(listToPos);

  let selectionOffset = 0;
  if (
    $toPos.nodeAfter &&
    $toPos.nodeAfter.type === node.type &&
    $toPos.nodeAfter.attrs.level === node.attrs.level
  ) {
    tr = joinDown(tr);
  }

  if (
    $fromPos.nodeBefore &&
    $fromPos.nodeBefore.type === node.type &&
    $fromPos.nodeBefore.attrs.level === node.attrs.level
  ) {
    selectionOffset -= 2;
    tr = joinUp(tr);
  }

  const selection = TextSelection.create(
    tr.doc,
    initialSelection.from + selectionOffset ,
    initialSelection.to + selectionOffset,
  );

  tr = tr.setSelection(selection);
  return tr;
}
