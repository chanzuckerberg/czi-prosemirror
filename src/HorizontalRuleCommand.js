// @flow

import Command from './Command';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {HORIZONTAL_RULE} from './NodeNames';
import {Fragment, Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

function insertHorizontalRule(
  tr: Transform,
  schema: Schema,
): Transform {
  const {selection, doc} = tr;
  if (!selection) {
    return tr;
  }
  const {from, to} = selection;
  if (from !== to) {
    return tr;
  }

  const horizontalRule = schema.nodes[HORIZONTAL_RULE];
  if (!horizontalRule) {
    return tr;
  }

  const prevNode = tr.doc.nodeAt(from);
  const node = horizontalRule.create({}, null, null);
  const frag = Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}

class HorizontalRuleCommand extends Command {

  _schema: Schema;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();
    this._schema = schema;
  }

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection} = state;
    const tr = insertHorizontalRule(
      state.tr.setSelection(selection),
      this._schema,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  }
}

export default HorizontalRuleCommand;
