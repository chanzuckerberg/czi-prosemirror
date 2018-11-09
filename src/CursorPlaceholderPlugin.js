// @flow
import {EditorState, Plugin} from 'prosemirror-state';
import {Decoration, DecorationSet} from "prosemirror-view"

// https://prosemirror.net/examples/upload/

const STATE_SPEC = {
  init() {
    return DecorationSet.empty;
  },

  apply(tr, set) {
    // Adjust decoration positions to changes made by the transaction
    set = set.map(tr.mapping, tr.doc);
    // See if the transaction adds or removes any placeholders
    let action = tr.getMeta(this);
    if (action && action.add) {
      let widget = document.createElement('cz-cursor-placeholder');
      let deco = Decoration.widget(
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
};

let singleton = null;

class CursorPlaceholderPlugin extends Plugin {

  getSingleton() {
    if (!singleton) {
      singleton = new CursorPlaceholderPlugin();
    }
    return singleton;
  }

  constructor() {
    if (singleton) {
      return singleton;
    }
    let self;
    super({
      state: STATE_SPEC,
      props: {
        decorations: (state) => {
          return self ? self.getState(state) : [];
        },
      },
    });
    singleton = this;
    self = this;
  };
}

export default CursorPlaceholderPlugin;
