// @flow

import UICommand from './ui/UICommand';
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

class HorizontalRuleCommand extends UICommand {

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection, schema} = state;
    const tr = insertHorizontalRule(
      state.tr.setSelection(selection),
      schema,
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
