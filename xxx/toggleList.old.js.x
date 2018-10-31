// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/plugins/lists/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/commands/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import canJoinDown from './canJoinDown';
import canJoinUp from './canJoinUp';
import findAncestorPosition from './findAncestorPosition';
import getAdjustedSelection from './getAdjustedSelection';
import getGroupsInRange from './getGroupsInRange';
import isListNode from './isListNode';
import isRangeOfType from './isRangeOfType';
import isRangeWithList from './isRangeWithList';
import joinDown from './joinDown';
import joinUp from './joinUp';
import lift from './lift';
import liftSelection from './liftSelection';
import nullthrows from 'nullthrows';
import wrapInList from './wrapInList';
import {Schema, NodeType, ResolvedPos} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import liftListItem from './liftListItem';

export default function toggleList(
  tr: Transform,
  schema: Schema,
  nodeType: NodeType,
): Transform {
  if (
    !schema.nodes.bulletList ||
    !schema.nodes.orderedList ||
    !schema.nodes.listItem||
    !tr.selection
  ) {
    return tr;
  }

  const initialSelection = tr.selection;

  const groups = getGroupsInRange(
    tr.doc,
    initialSelection.$from,
    initialSelection.$to,
    isListNode,
  );

  const {$from} = groups[0];
  const {$to} = groups[groups.length - 1];
  tr = tr.setSelection(new TextSelection($from, $to));

  const adjustedSelection = getAdjustedSelection(
    nullthrows(tr.doc),
    nullthrows(tr.selection),
  );

  const shouldUntoggle = isRangeOfType(
    tr.doc,
    adjustedSelection.$from,
    adjustedSelection.$to,
    nodeType,
  );

  const rangeContainsList = isRangeWithList(
    tr.doc,
    adjustedSelection.$from,
    adjustedSelection.$to,
  );

  const shouldConvertToType =
    !shouldUntoggle &&
    (isListNode(nullthrows($from.node(1))) || rangeContainsList);

  // Quick-fix to keep positions
  groups.reverse();
  groups.forEach((group) => {
    tr = toggleListAtSelection(
      tr,
      schema,
      nodeType,
      group.$from,
      group.$to,
      shouldUntoggle,
      shouldConvertToType,
    );
  });

  // Reset selection.
  // tr = tr.setSelection(
  //   new TextSelection(
  //     initialSelection.$from,
  //     initialSelection.$to,
  //   ),
  // );
  return tr;
}

function toggleListAtSelection(
  tr: Transform,
  schema: Schema,
  nodeType: NodeType,
  $from: ResolvedPos,
  $to: ResolvedPos,
  shouldUntoggle: boolean,
  shouldConvertToType: boolean,
): Transform {
  tr = tr.setSelection(new TextSelection($from, $to));

  const adjustedSelection = getAdjustedSelection(
    nullthrows(tr.doc),
    nullthrows(tr.selection),
  );

  if ($from === $to) {
    tr = tr.setSelection(adjustedSelection);
    $from = tr.selection.$from;
    $to = tr.selection.$to;
  }

  if (shouldUntoggle) {
    // Disable List
    if ($from.parent === $to.parent) {
      tr = lift(tr);
    }
    tr = liftSelection(
      tr,
      adjustedSelection.$from,
      adjustedSelection.$to,
    );

  } else if (shouldConvertToType) {
    tr = tr.setSelection(adjustedSelection);

    tr = liftSelection(
      tr,
      adjustedSelection.$from,
      adjustedSelection.$to,
    );

    // TODO: Support indentation level.

    // TODO: It shall update initialSelection, too.
    tr = wrapInList(tr, nodeType);

    if (canJoinUp(tr.selection, tr.doc, nodeType)) {
      tr = joinUp(tr);
    }
    if (canJoinDown(tr.selection, tr.doc, nodeType)) {
      tr = joinDown(tr);
    }
  } else {
    // Enable List
    tr = tr.setSelection(adjustedSelection);
    // TODO: provide param `attr` to `wrapInList()`, too.
    tr = wrapInList(tr, nodeType);

    if (canJoinUp(tr.selection, tr.doc, nodeType)) {
      tr = joinUp(tr);
    }

    if (canJoinDown(tr.selection, tr.doc, nodeType)) {
      /*
      * joinDown expects the selection to be from the end of our last node to
      * the beginning of the next. So we need to adjust our selection a bit.
      * */
      const ap = findAncestorPosition(tr.doc, tr.selection.$to);
      tr = tr.setSelection(
        new TextSelection(
          tr.selection.$to,
          tr.doc.resolve(tr.selection.$to.after(ap.depth)),
        ),
      );
      tr = joinDown(tr);
    }

  }
  return tr;
}
