// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js

import {Fragment, Schema, NodeType, NodeRange, ResolvedPos, Slice} from 'prosemirror-model';
import {canSplit, findWrapping, ReplaceAroundStep} from 'prosemirror-transform';
import {Transform} from 'prosemirror-transform';

export default function wrapInList(
  tr: Transform,
  nodeType: NodeType,
  attrs?: ?Object,
): Transform {
  const {selection, doc} = tr;
  if (!selection || !doc) {
    return tr;
  }
  let {$from, $to} = selection;
  let range = $from.blockRange($to);
  let doJoin = false;
  let outerRange = range;
  if (!range) {
    return tr;
  }
  // This is at the top of an existing list item
  if (
    range.depth >= 2 &&
    $from.node(range.depth - 1).type.compatibleContent(nodeType) &&
    range.startIndex === 0
  ) {
    // Don't do anything if this is the top of the list
    if ($from.index(range.depth - 1) == 0) {
      return tr;
    }

    let $insert = tr.doc.resolve(range.start - 2);
    outerRange = new NodeRange($insert, $insert, range.depth);
    if (range.endIndex < range.parent.childCount) {
      range = new NodeRange(
        $from,
        tr.doc.resolve($to.end(range.depth)),
        range.depth,
      );
    }
    doJoin = true;
  }
  const wrappers = findWrapping(outerRange, nodeType, attrs, range);
  return doWrapInList(
    tr,
    range,
    wrappers,
    doJoin,
    nodeType,
  );
}

function doWrapInList(
  tr: Transform,
  range: NodeRange,
  wrappers: any,
  doJoin: boolean,
  nodeType: NodeType,
): Transform {
  if (!wrappers) {
    return tr;
  }
  let content = Fragment.empty;
  for (let i = wrappers.length - 1; i >= 0; i--) {
    content = Fragment.from(
      wrappers[i].type.create(wrappers[i].attrs, content),
    );
  }

  tr = tr.step(
    new ReplaceAroundStep(range.start - (doJoin ? 2 : 0),
    range.end,
    range.start,
    range.end,
    new Slice(content, 0, 0), wrappers.length, true),
  );

  let found = 0
  for (let i = 0; i < wrappers.length; i++) {
    if (wrappers[i].type == nodeType) {
      found = i + 1;
    }
  };

  let splitDepth = wrappers.length - found;
  let splitPos = range.start + wrappers.length - (doJoin ? 2 : 0);
  let parent = range.parent;
  for (
    let i = range.startIndex, e = range.endIndex, first = true;
    i < e; i++,
    first = false
  ) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr = tr.split(splitPos, splitDepth)
      splitPos += 2 * splitDepth;
    }
    splitPos += parent.child(i).nodeSize;
  }
  return tr;
}
