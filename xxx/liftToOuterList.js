// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js

import {liftTarget, Transform, ReplaceAroundStep} from 'prosemirror-transform';
import {Fragment, NodeType, NodeRange, Slice} from 'prosemirror-model';

export default function liftToOuterList(
  tr: Transform,
  itemType: NodeType,
  range: NodeRange,
) {
  let end = range.end;
  let endOfList = range.$to.end(range.depth);
  if (end < endOfList) {
    // There are siblings after the lifted items, which must become
    // children of the last item
    const frag = Fragment.from(itemType.create(null, range.parent.copy()));
    const slice = new Slice(frag, 1, 0);
    const step = new ReplaceAroundStep(
      end - 1,
      endOfList,
      end,
      endOfList,
      slice,
      1,
      true,
    );
    tr = tr.step(step);
    range = new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(endOfList),
      range.depth,
    );
  }
  return tr.lift(range, liftTarget(range));
}
