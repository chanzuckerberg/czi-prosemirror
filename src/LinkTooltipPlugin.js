// @flow

import {EditorState, Plugin, PluginKey} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

import {MARK_LINK} from './MarkNames';
import {
  hideSelectionPlaceholder,
  showSelectionPlaceholder,
} from './SelectionPlaceholderPlugin';
import applyMark from './applyMark';
import findNodesWithSameMark from './findNodesWithSameMark';
import lookUpElement from './lookUpElement';
import LinkTooltip from './ui/LinkTooltip';
import LinkURLEditor from './ui/LinkURLEditor';
import {atAnchorTopCenter} from './ui/PopUpPosition';
import createPopUp from './ui/createPopUp';

import './ui/czi-pop-up.css';

// https://prosemirror.net/examples/tooltip/
const SPEC = {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  key: new PluginKey('LinkTooltipPlugin'),
  view(editorView: EditorView) {
    return new LinkTooltipView(editorView);
  },
};

class LinkTooltipPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

class LinkTooltipView {
  _anchorEl = null;
  _popup = null;
  _editor = null;

  constructor(editorView: EditorView) {
    this.update(editorView, null);
  }

  update(view: EditorView, lastState: EditorState): void {
    if (view.readOnly) {
      this.destroy();
      return;
    }

    const {state} = view;
    const {doc, selection, schema} = state;
    const markType = schema.marks[MARK_LINK];
    if (!markType) {
      return;
    }
    const {from, to} = selection;
    const result = findNodesWithSameMark(doc, from, to, markType);

    if (!result) {
      this.destroy();
      return;
    }
    const domFound = view.domAtPos(from);
    if (!domFound) {
      this.destroy();
      return;
    }
    const anchorEl = lookUpElement(domFound.node, el => el.nodeName === 'A');
    if (!anchorEl) {
      this.destroy();
      return;
    }

    const popup = this._popup;
    const viewPops = {
      editorState: state,
      editorView: view,
      href: result.mark.attrs.href,
      onCancel: this._onCancel,
      onEdit: this._onEdit,
      onRemove: this._onRemove,
    };

    if (popup && anchorEl === this._anchorEl) {
      popup.update(viewPops);
    } else {
      popup && popup.close();
      this._anchorEl = anchorEl;
      this._popup = createPopUp(LinkTooltip, viewPops, {
        anchor: anchorEl,
        autoDismiss: false,
        onClose: this._onClose,
        position: atAnchorTopCenter,
      });
    }
  }

  destroy() {
    this._popup && this._popup.close();
    this._editor && this._editor.close();
  }

  _onCancel = (view: EditorView): void => {
    this.destroy();
    view.focus();
  };

  _onClose = (): void => {
    this._anchorEl = null;
    this._editor = null;
    this._popup = null;
  };

  _onEdit = (view: EditorView): void => {
    if (this._editor) {
      return;
    }

    const {state} = view;
    const {schema, doc, selection} = state;
    const {from, to} = selection;
    const markType = schema.marks[MARK_LINK];
    const result = findNodesWithSameMark(doc, from, to, markType);
    if (!result) {
      return;
    }
    let {tr} = state;
    const linkSelection = TextSelection.create(
      tr.doc,
      result.from.pos,
      result.to.pos + 1
    );

    tr = tr.setSelection(linkSelection);
    tr = showSelectionPlaceholder(state, tr);
    view.dispatch(tr);

    const href = result ? result.mark.attrs.href : null;
    this._editor = createPopUp(
      LinkURLEditor,
      {href},
      {
        onClose: value => {
          this._editor = null;
          this._onEditEnd(view, selection, value);
        },
      }
    );
  };

  _onRemove = (view: EditorView): void => {
    this._onEditEnd(view, view.state.selection, null);
  };

  _onEditEnd = (
    view: EditorView,
    initialSelection: TextSelection,
    href: ?string
  ): void => {
    const {state, dispatch} = view;
    let tr = hideSelectionPlaceholder(state);

    if (href !== undefined) {
      const {schema} = state;
      const markType = schema.marks[MARK_LINK];
      if (markType) {
        const result = findNodesWithSameMark(
          tr.doc,
          initialSelection.from,
          initialSelection.to,
          markType
        );
        if (result) {
          const linkSelection = TextSelection.create(
            tr.doc,
            result.from.pos,
            result.to.pos + 1
          );
          tr = tr.setSelection(linkSelection);
          const attrs = href ? {href} : null;
          tr = applyMark(tr, schema, markType, attrs);
		  
          // [FS] IRAD-1005 2020-07-09
          // Upgrade outdated packages.
          // reset selection to original using the latest doc.
          const origSelection = TextSelection.create(
            tr.doc,
            initialSelection.from,
            initialSelection.to
          );
          tr = tr.setSelection(origSelection);
        }
      }
    }
    dispatch(tr);
    view.focus();
  };
}

export default LinkTooltipPlugin;
