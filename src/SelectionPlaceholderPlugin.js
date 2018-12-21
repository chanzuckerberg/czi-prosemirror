// @flow

import {EditorState, Plugin} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {Decoration, DecorationSet} from 'prosemirror-view';

import './ui/czi-selection-placeholder.css';

const PLACE_HOLDER_ID = {name: 'SelectionPlaceholderPlugin'};

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
        const deco = Decoration.inline(
          action.add.from,
          action.add.to,
          {
            class: 'czi-selection-placeholder',
          },
          {
            id: PLACE_HOLDER_ID,
          },
        );
        set = set.add(tr.doc, [deco]);
      } else if (action.remove) {
        const found = set.find(null, null, specFinder);
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

class SelectionPlaceholderPlugin extends Plugin {

  constructor() {
    super(SPEC);
    if (singletonInstance) {
      return singletonInstance;
    }
    singletonInstance = this;
  };
}

function specFinder(spec: Object): boolean {
  return spec.id == PLACE_HOLDER_ID;
}

function findSelectionPlaceholder(state: EditorState): ?Decoration {
  if (!singletonInstance) {
    return null;
  }
  const decos = singletonInstance.getState(state);
  const found = decos.find(null, null, specFinder);
  const pos = found.length ? found[0] : null;
  return pos || null;
}

export function showSelectionPlaceholder(
  state: EditorState,
  tr: ?Transform,
): Transform {
  tr = tr || state.tr;
  const plugin = singletonInstance;

  if (!plugin || !tr.selection || tr.selection.empty) {
    return tr;
  }

  const deco = findSelectionPlaceholder(state);
  if (deco === null) {
    tr = tr.setMeta(plugin, {
      add: {
        from: tr.selection.from,
        to: tr.selection.to,
      },
    });
  }

  return tr;
}

export function hideSelectionPlaceholder(
  state: EditorState,
  tr: ?Transform,
): Transform {
  tr = tr || state.tr;
  const plugin = singletonInstance;
  if (!plugin) {
    return tr;
  }

  const deco = findSelectionPlaceholder(state);
  if (deco) {
    tr = tr.setMeta(plugin, {
      remove: {},
    });
  }

  return tr;
}

export default SelectionPlaceholderPlugin;
