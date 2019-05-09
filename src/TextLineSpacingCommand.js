// @flow

import UICommand from './ui/UICommand';
import {AllSelection, TextSelection} from 'prosemirror-state';
import {BLOCKQUOTE, HEADING, LIST_ITEM, PARAGRAPH} from './NodeNames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import {DOUBLE_LINE_SPACING, SINGLE_LINE_SPACING} from './ui/toCSSLineSpacing';

export function setTextLineSpacing(
  tr: Transform,
  schema: Schema,
  lineSpacing: ?string
): Transform {
  const {selection, doc} = tr;
  if (!selection || !doc) {
    return tr;
  }

  if (
    !(selection instanceof TextSelection) &&
    !(selection instanceof AllSelection)
  ) {
    return tr;
  }

  const {from, to} = selection;
  const paragraph = schema.nodes[PARAGRAPH];
  const heading = schema.nodes[HEADING];
  const listItem = schema.nodes[LIST_ITEM];
  const blockquote = schema.nodes[BLOCKQUOTE];
  if (!paragraph && !heading && !listItem && !blockquote) {
    return tr;
  }

  const tasks = [];
  const lineSpacingValue = lineSpacing || null;

  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    if (
      nodeType === paragraph ||
      nodeType === heading ||
      nodeType === listItem ||
      nodeType === blockquote
    ) {
      const lineSpacing = node.attrs.lineSpacing || null;
      if (lineSpacing !== lineSpacingValue) {
        tasks.push({
          node,
          pos,
          nodeType,
        });
      }
      return nodeType === listItem ? true : false;
    }
    return true;
  });

  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {node, pos, nodeType} = job;
    let {attrs} = node;
    if (lineSpacingValue) {
      attrs = {
        ...attrs,
        lineSpacing: lineSpacingValue,
      };
    } else {
      attrs = {
        ...attrs,
        lineSpacing: null,
      };
    }
    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });

  return tr;
}

function createGroup(): Array<{[string]: TextLineSpacingCommand}> {
  const group = {
    Single: new TextLineSpacingCommand(SINGLE_LINE_SPACING),
    ' 150% ': new TextLineSpacingCommand('150%'),
    Double: new TextLineSpacingCommand(DOUBLE_LINE_SPACING),
  };
  return [group];
}

class TextLineSpacingCommand extends UICommand {
  _lineSpacing: ?string;

  static createGroup = createGroup;

  constructor(lineSpacing: ?string) {
    super();
    this._lineSpacing = lineSpacing;
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
        node.attrs.lineSpacing === this._lineSpacing
      ) {
        keepLooking = false;
        active = true;
      }
      return keepLooking;
    });
    return active;
  };

  isEnabled = (state: EditorState): boolean => {
    return this.isActive(state) || this.execute(state);
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView
  ): boolean => {
    const {schema, selection} = state;
    const tr = setTextLineSpacing(
      state.tr.setSelection(selection),
      schema,
      this._lineSpacing
    );
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
}

export default TextLineSpacingCommand;
