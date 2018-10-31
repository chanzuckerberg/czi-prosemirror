// @flow

import canJoinDown from './canJoinDown';
import canJoinUp from './canJoinUp';
import joinDown from './joinDown';
import joinUp from './joinUp';
import lift from './lift';
import liftListItem from './liftListItem';
import liftSelection from './liftSelection';
import wrapInList from './wrapInList';
import {Schema, NodeType} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

export default function toggleList(
  tr: Transform,
  schema: Schema,
  nodeType: NodeType,
  initialSelection: Selection,
): Transform {
  tr = tr.setSelection(initialSelection);
  const {selection} = tr;
  if (!selection) {
    return tr;
  }
  const {$from, $to} = selection;
  const grandParent = $from.node(-2);
  const greatGrandParent = $from.node(-3);
  switch (true) {
    case (
      grandParent &&
      grandParent.type === nodeType
    ):
      // Disable type.
      const isNestedList = greatGrandParent &&
        greatGrandParent.type === schema.nodes.listItem;
      if (!isNestedList) {
        // If this is not an nested list, disable the list.
        tr = liftListItem(tr, schema);
      }
      break;
    case (
      grandParent &&
      grandParent.type === schema.nodes.bulletList &&
      nodeType === schema.nodes.orderedList
    ):
    case (
      grandParent &&
      grandParent.type === schema.nodes.orderedList &&
      nodeType === schema.nodes.bulletList
    ):
      // Switch type.
      // const result = findParentNodeOfType(nodeType)(selection);
      // tr.setNodeType
      // console.log(result);
      // tr = splitListItem(tr, schema);
      // tr = liftListItem(tr, schema);
      // tr = lift(tr);

      tr = liftSelection(tr, selection.$from, selection.$to);
      // TODO: provide param `attr` to `wrapInList()`, too.
      tr = wrapInList(tr, nodeType);


      // const startPos = $from.start($from.depth);
      // const endPos = $to.end($to.depth);
      // tr.doc.nodesBetween(startPos, endPos, (node, pos) => {
      //   if (node === grandParent) {
      //     tr = tr.setNodeMarkup(pos, nodeType, node.attrs, node.marks);
      //   }
      // });

      break;
    default:
      // Enable type.
      tr = wrapInList(tr, nodeType);
  }

  if (canJoinUp(tr.selection, tr.doc, nodeType)) {
    // tr = joinUp(tr);
  }
  if (canJoinDown(tr.selection, tr.doc, nodeType)) {
    // tr = joinDown(tr);
  }

  return tr;
};
