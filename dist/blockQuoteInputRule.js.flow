// @flow

import {InputRule} from 'prosemirror-inputrules';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

import {BLOCKQUOTE} from './NodeNames';
import toggleBlockquote from './toggleBlockquote';

// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
const MACRO_PATTERN = /^\s*>\s$/;

function handleBlockQuoteInputRule(
  state: EditorState,
  match: any,
  start: any,
  end: any,
): Transform {
  const {schema} = state;
  let {tr} = state;
  const nodeType = schema.nodes[BLOCKQUOTE];
  if (!nodeType) {
    return tr;
  }
  tr = state.tr.delete(start, end);
  tr = toggleBlockquote(tr, schema);
  return tr;
}

export default function blockQuoteInputRule(): InputRule {
  return new InputRule(MACRO_PATTERN,  handleBlockQuoteInputRule);
}