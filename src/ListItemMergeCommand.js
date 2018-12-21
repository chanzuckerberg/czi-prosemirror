// @flow

import {Fragment, Schema} from 'prosemirror-model';

import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {LIST_ITEM} from './NodeNames';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import UICommand from './ui/UICommand';
import {findParentNodeOfType} from 'prosemirror-utils';

function mergeListItemUp(
  tr: Transform,
  schema: Schema,
): Transform {
  // This merge a list item to is previous list item of the selection is at the
  // beginning of the list item.
  const {selection} = tr;
  if (!selection) {
    return tr;
  }
  const nodeType = schema.nodes[LIST_ITEM];
  if (!nodeType) {
    return tr;
  }
  const {from, empty} = selection;
  if (!empty) {
    // Selection is collapsed.
    return tr;
  }
  const result = findParentNodeOfType(nodeType)(selection);
  if (!result) {
    return tr;
  }
  const {pos, node} = result;
  if (from !== (pos + 2)) {
    // Selection is not at the begining of the list item.
    return tr;
  }
  const $pos = tr.doc.resolve(pos);
  const prevNode = $pos.nodeBefore;
  if (!prevNode || prevNode.type !== nodeType) {
    return tr;
  }
  if (node.childCount !== 1) {
    // list item should only have one child (paragraph).
    return tr;
  }

  const paragraphNode = node.firstChild;
  const textNode = schema.text(' ');

  // Delete the list item
  tr = tr.delete(pos - 2, pos + node.nodeSize);
  // Append extra space character to its previous list item.
  tr = tr.insert(pos - 2, Fragment.from(textNode));
  // Move the content to its previous list item.
  tr = tr.insert(pos - 1, Fragment.from(paragraphNode.content));
  tr = tr.setSelection(TextSelection.create(
    tr.doc,
    pos - 1,
    pos - 1,
  ));
  return tr;
}


function mergeListItemDown(
  tr: Transform,
  schema: Schema,
): Transform {
  // This merge a list item to is next list item of the selection is at the
  // beginning of the list item.
  const {selection} = tr;
  if (!selection) {
    return tr;
  }
  const nodeType = schema.nodes[LIST_ITEM];
  if (!nodeType) {
    return tr;
  }
  const {from, empty} = selection;
  if (!empty) {
    // Selection is collapsed.
    return tr;
  }
  const result = findParentNodeOfType(nodeType)(selection);
  if (!result) {
    return tr;
  }
  const {pos, node} = result;
  if (from !== (pos + node.content.size)) {
    // Selection is not at the begining of the list item.
    return tr;
  }

  const nextFrom = pos + node.nodeSize;
  if (nextFrom >= (tr.doc.content.size)) {
    return tr;
  }
  const nextNode = tr.doc.nodeAt(nextFrom);

  if (!nextNode || nextNode.type !== nodeType) {
    return tr;
  }

  if (nextNode.childCount !== 1) {
    // list item should only have one child (paragraph).
    return tr;
  }

  const paragraphNode = nextNode.firstChild;
  const textNode = schema.text(' ');
  // Delete the list item.
  tr = tr.delete(nextFrom, nextFrom + nextNode.nodeSize);
  // Append extra space character to its previous list item.
  tr = tr.insert(nextFrom - 2, Fragment.from(paragraphNode.content));
  // Move the content to the list item.
  tr = tr.insert(nextFrom - 2, Fragment.from(textNode));
  tr = tr.setSelection(TextSelection.create(
    tr.doc,
    nextFrom - 2,
    nextFrom - 2,
  ));
  return tr;
}

class ListItemMergeCommand extends UICommand {

  _direction = '';

  constructor(direction: string) {
    super();
    this._direction = direction;
  }

  isActive = (state: EditorState): boolean => {
    return false;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {selection, schema} = state;
    let {tr} = state;
    const direction = this._direction;
    if (direction === 'down') {
      tr = mergeListItemDown(
        tr.setSelection(selection),
        schema,
      );
    } else if (direction === 'up') {
      tr = mergeListItemUp(
        tr.setSelection(selection),
        schema,
      );
    }

    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
}


export default ListItemMergeCommand;
