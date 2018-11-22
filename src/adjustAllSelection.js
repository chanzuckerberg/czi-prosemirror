// @flow

import {Schema} from 'prosemirror-model';
import {AllSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import selectBodyContent from './selectBodyContent';

export default function adjustAllSelection(
  tr: Transform,
  schema: Schema,
): Transform {
  const {selection} = tr;
  if (selection instanceof AllSelection) {
    return selectBodyContent(tr, schema);
  }
  return tr;
}
