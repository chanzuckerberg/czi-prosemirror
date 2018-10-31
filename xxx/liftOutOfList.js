// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js

import {liftTarget, Transform, ReplaceAroundStep} from 'prosemirror-transform';
import {Fragment, NodeType, NodeRange, Slice} from 'prosemirror-model';

export default function liftOutOfList(
  tr: Transform,
  range: NodeRange,
) {

  let list = range.parent;

  // Merge the list items into a single big item
  for (let pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
    pos -= list.child(i).nodeSize;
    tr = tr.delete(pos - 1, pos + 1);
  }
  let $start = tr.doc.resolve(range.start);
  let item = $start.nodeAfter;
  let atStart = range.startIndex == 0, atEnd = range.endIndex == list.childCount
  let parent = $start.node(-1), indexBefore = $start.index(-1)
  if (!parent.canReplace(indexBefore + (atStart ? 0 : 1), indexBefore + 1,
                         item.content.append(atEnd ? Fragment.empty : Fragment.from(list)))) {
                           return tr;
                         }

  let start = $start.pos, end = start + item.nodeSize
  // Strip off the surrounding list. At the sides where we're not at
  // the end of the list, the existing list is closed. At sides where
  // this is the end, it is overwritten to its end.
  tr = tr.step(new ReplaceAroundStep(start - (atStart ? 1 : 0), end + (atEnd ? 1 : 0), start + 1, end - 1,
                                new Slice((atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty)))
                                          .append(atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))),
                                          atStart ? 0 : 1, atEnd ? 0 : 1), atStart ? 0 : 1))
  return tr;
}
