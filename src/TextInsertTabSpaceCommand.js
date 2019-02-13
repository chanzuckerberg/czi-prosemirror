// @flow

import {Fragment} from 'prosemirror-model';
import {EditorState, TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {EditorView} from 'prosemirror-view';

import {HEADING, LIST_ITEM, PARAGRAPH} from './NodeNames';
import UICommand from './ui/UICommand';

const WIDE_SPACE_CHAR = '\u3000';

class TextInsertTabSpaceCommand extends UICommand {
  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent,
  ): boolean => {
    const {selection, schema, tr} = state;
    if (!selection.empty || !(selection instanceof TextSelection)) {
      return false;
    }
    const paragraph = schema.nodes[PARAGRAPH];
    const heading = schema.nodes[HEADING];
    const listItem = schema.nodes[LIST_ITEM];

    const found =
      (listItem && findParentNodeOfType(listItem)(selection)) ||
      (paragraph && findParentNodeOfType(paragraph)(selection)) ||
      (heading && findParentNodeOfType(heading)(selection));

    if (!found) {
      return false;
    }

   const {from, to} = selection;

   if (found.node.type === listItem && found.pos === from - 2) {
     // Cursur is at te begin of the list-item, let the default indentation
     // behavior happen.
     return false;
   }

    if (dispatch) {
      const textNode = schema.text(WIDE_SPACE_CHAR);
      dispatch(tr.insert(to, Fragment.from(textNode)));
    }

    return true;
  };
}

export default TextInsertTabSpaceCommand;