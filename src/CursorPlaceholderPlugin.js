// @flow

import './ui/czi-cursor-placeholder.css';
import uuid from 'uuid/v1';
import {EditorState, Plugin} from 'prosemirror-state';
import {EditorView, Decoration, DecorationSet} from "prosemirror-view";
import {Transform} from 'prosemirror-transform';

const PLACE_HOLDER_ID = {};
let singletonInstance = null;

// https://prosemirror.net/examples/upload/
const SPEC = {
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      debugger;
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc);
      // See if the transaction adds or removes any placeholders
      const action = tr.getMeta(this);
      if (action && action.add) {
        const widget = document.createElement('czi-cursor-placeholder');
        widget.className = 'czi-cursor-placeholder';
        const deco = Decoration.widget(
          action.add.pos,
          widget, {id: action.add.id},
        );
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        const finder = spec => spec.id == action.remove.id;
        const found = set.find(null, null, finder);
        set = set.remove(found);
      }
      return set;
    },
  },
  props: {
    decorations: (state) => {
      const plugin = singletonInstance;
      return plugin ? plugin.getState(state) : null;
    },
  },
};

class CursorPlaceholderPlugin extends Plugin {

  constructor() {
    if (singletonInstance) {
      return singletonInstance;
    }
    super(SPEC);
    singletonInstance = this;
  };
}

function findCursorPlaceholderPos(state: EditorState): ?number {
  if (!singletonInstance) {
    return null;
  }
  const decos = singletonInstance.getState(state);
  const found = decos.find(null, null, spec => spec.id == PLACE_HOLDER_ID)
  const pos = found.length ? found[0].from : null;
  return pos || null;
}

export function showCursorPlaceholder(state: EditorState): Transform {
  const plugin = singletonInstance;
  let {tr} = state;
  if (!plugin || !tr.selection) {
    return tr;
  }

  const pos = findCursorPlaceholderPos(state);
  if (pos === null) {
    if (!tr.selection.empty) {
      // Replace the selection with a placeholder.
      tr = tr.deleteSelection();
    }
    tr = tr.setMeta(plugin, {
      add: {
        id: PLACE_HOLDER_ID,
        pos: tr.selection.from
      },
    });
  }

  return tr;
}

export function hideCursorPlaceholder(state: EditorState): Transform {
  const plugin = singletonInstance;
  let {tr} = state;
  if (!plugin) {
    return tr;
  }

  const pos = findCursorPlaceholderPos(state);
  if (pos !== null) {
    tr = tr.setMeta(plugin, {
      remove: {
        id: PLACE_HOLDER_ID,
        pos,
      },
    });
  }

  return tr;
}

export default CursorPlaceholderPlugin;
