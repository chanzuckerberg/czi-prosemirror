// @flow

import UICommand from './ui/UICommand';
import noop from './noop';
import nullthrows from 'nullthrows';
import toggleHeading from './toggleHeading';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {HEADING, PARAGRAPH} from './NodeNames';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';
import {setBlockType} from 'prosemirror-commands';

export function setTextAlign(
  tr: Transform,
  schema: Schema,
  alignment: ?string,
): Transform {
  const {selection, doc} = tr;
  if (!selection || !doc) {
    return tr;
  }
  const {from, to, empty} = selection;

  const paragraph = schema.nodes[PARAGRAPH];
  const heading = schema.nodes[HEADING];
  if (!paragraph && !heading) {
    return tr;
  }

  const tasks = [];
  alignment = alignment || null;

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    console.log(nodeType.name);
    if (nodeType === paragraph || nodeType === heading) {
      const align = node.attrs.align || null;
      if (align !== alignment) {
        tasks.push({
          node,
          pos,
          nodeType,
        });
      }
    }
    return true;
  });
  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {node, pos, nodeType} = job;
    let attrs;
    if (alignment) {
      attrs = {
        ...attrs,
        align: alignment,
      };
    } else {
      attrs = {
        ...attrs,
        align: null,
      };
    }
    tr = tr.setNodeMarkup(
      pos,
      nodeType,
      attrs,
      node.marks,
    );
  });

  return tr;
}

class TextAlignCommand extends UICommand {

  _alignment: string;

  constructor(alignment: string) {
    super();
    this._alignment = alignment;
  }

  isActive = (state: EditorState): boolean => {
    const {selection, doc, schema} = state;
    const {from, to} = selection;
    const paragraph = schema.nodes[PARAGRAPH];
    const heading = schema.nodes[HEADING];
    let keepLooking = true;
    let active = false;
    doc.nodesBetween(from, to, (node, pos) => {
      const nodeType = node.type;
      if (
        keepLooking &&
        (nodeType === paragraph || nodeType === heading) &&
        node.attrs.align === this._alignment
      ) {
        keepLooking = false;
        active = true;
      }
      return keepLooking;
    });
    return active;
  };

  isEnabled = (state: EditorState): boolean => {
    const {selection} = state;
    return (selection instanceof TextSelection);
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {schema, selection} = state;
    const tr = setTextAlign(
      state.tr.setSelection(selection),
      schema,
      this._alignment,
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr.scrollIntoView());
      return true;
    } else {
      return false;
    }
  };
}

export default TextAlignCommand;
