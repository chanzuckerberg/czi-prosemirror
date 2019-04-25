// @flow

import {EditorState, Plugin} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {Decoration, DecorationSet} from 'prosemirror-view';

import './ui/czi-cursor-placeholder.css';

const PLACE_HOLDER_ID = {name: 'CursorPlaceholderPlugin'};

let singletonInstance = null;

// https://prosemirror.net/examples/upload/
const SPEC = {
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      set = set.map(tr.mapping, tr.doc);
      const action = tr.getMeta(this);
      if (!action) {
        return set;
      }
      if (action.add) {
        const widget = document.createElement('czi-cursor-placeholder');
        widget.className = 'czi-cursor-placeholder';
        const deco = Decoration.widget(action.add.pos, widget, {
          id: PLACE_HOLDER_ID,
        });
        set = set.add(tr.doc, [deco]);
      } else if (action.remove) {
        const found = set.find(null, null, specFinder);
        set = set.remove(found);
      }

      return set;
    },
  },
  props: {
    decorations: state => {
      const plugin = singletonInstance;
      return plugin ? plugin.getState(state) : null;
    },
  },
};

class CursorPlaceholderPlugin extends Plugin {
  constructor() {
    super(SPEC);
    if (singletonInstance) {
      return singletonInstance;
    }
    singletonInstance = this;
  }
}

function specFinder(spec: Object): boolean {
  return spec.id === PLACE_HOLDER_ID;
}

function findCursorPlaceholderPos(state: EditorState): ?number {
  if (!singletonInstance) {
    return null;
  }
  const decos = singletonInstance.getState(state);
  const found = decos.find(null, null, specFinder);
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
        pos: tr.selection.from,
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
      remove: {},
    });
  }

  return tr;
}

export default CursorPlaceholderPlugin;
