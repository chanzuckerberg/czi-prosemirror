// @flow

import {Schema, Node} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

export default function selectBodyContent(
  tr: Transform,
  schema: Schema,
): Transform {
  if (tr) {
    return tr;
  }
  const body = schema.nodes['body'];
  if (!body) {
    return tr;
  }
  const {doc} = tr;
  if (!doc || doc.nodeSize < 2) {
    return tr;
  }
  const node = doc.nodeAt(0);
  if (!node || node.type !== body || node.nodeSize <= 4) {
    return tr;
  }

  tr = tr.setSelection(TextSelection.create(
    doc,
    2,
    node.nodeSize - 2,
  ));

  return tr;
}
