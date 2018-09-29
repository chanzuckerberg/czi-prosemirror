// @flow

import getAdjustedSelection from './getAdjustedSelection';
import getGroupsInRange from './getGroupsInRange';
import isListNode from './isListNode';
import isRangeOfType from './isRangeOfType';
import isRangeWithList from './isRangeWithList';
import nullthrows from 'nullthrows';
import {Schema, NodeType, ResolvedPos} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import lift from './lift';

// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/plugins/lists/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default
export default function toggleList(
  tr: Transform,
  initialSelection: Selection,
  schema: Schema,
  nodeType: NodeType,
): Transform {
  if (
    !schema.nodes.bullet_list ||
    !schema.nodes.ordered_list ||
    !schema.nodes.list_item
  ) {
    return tr;
  }

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
      nodeType,
      group.$from,
      group.$to,
      shouldUntoggle,
      shouldConvertToType,
    );
  });

  tr = tr.setSelection(initialSelection);
  return tr;
}

function toggleListAtSelection(
  tr: Transform,
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
    if ($from.parent === $to.parent) {
      // commands.lift(pm, true);
      tr = lift(tr);
    }
    // liftSelection(pm, adjustedSelection.$from, adjustedSelection.$to).applyAndScroll();
    // this.resetSelection();
  } else if (shouldConvertToType) {
  //   const tr = liftSelection(pm, adjustedSelection.$from, adjustedSelection.$to).applyAndScroll();
  //   pm.setSelection(tr.selection);
  //   commands.wrapInList(nodeType)(pm);
  //
  //   if (canJoinUp(pm, pm.selection, pm.doc, nodeType)) {
  //     commands.joinUp(pm, true);
  //   }
  //
  //   if (canJoinDown(pm, pm.selection, pm.doc, nodeType)) {
  //     commands.joinDown(pm, true);
  //   }
  //
  //   this.resetSelection();
  // } else {
  //   pm.setSelection(this.adjustSelection(pm.selection));
  //   commands.wrapInList(nodeType)(pm);
  //
  //   if (canJoinUp(pm, pm.selection, pm.doc, nodeType)) {
  //     commands.joinUp(pm, true);
  //   }
  //
  //   if (canJoinDown(pm, pm.selection, pm.doc, nodeType)) {
  //     /*
  //      * joinDown expects the selection to be from the end of our last node to
  //      * the beginning of the next. So we need to adjust our selection a bit.
  //      * */
  //     pm.setSelection(new TextSelection(pm.selection.$to, pm.doc.resolve(pm.selection.$to.after(findAncestorPosition(pm, pm.selection.$to).depth))));
  //     commands.joinDown(pm, true);
  //   }
  //
  //   this.resetSelection();
  }
  return tr;
}
