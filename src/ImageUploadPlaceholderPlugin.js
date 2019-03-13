// @flow

import {Plugin} from 'prosemirror-state';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {Decoration, DecorationSet} from 'prosemirror-view';

import './ui/czi-image-upload-placeholder.css';

// https://prosemirror.net/examples/upload/
class ImageUploadPlaceholderPlugin extends Plugin {
  constructor() {
    super({
      state: {
        init() {
          return DecorationSet.empty;
        },
        apply(tr: Transform, set: DecorationSet): DecorationSet {
          // Adjust decoration positions to changes made by the transaction
          set = set.map(tr.mapping, tr.doc);
          // See if the transaction adds or removes any placeholders
          const action = tr.getMeta(this);
          if (action && action.add) {
            const el = document.createElement('div');
            el.className = 'czi-image-upload-placeholder';

            const deco = Decoration.widget(
              action.add.pos,
              el,
              {id: action.add.id},
            );

            set = set.add(tr.doc, [deco]);
          } else if (action && action.remove) {
            const finder = (spec) => spec.id == action.remove.id;
            set = set.remove(set.find(null, null, finder));
          }
          return set;
        }
      },
      props: {
        decorations(state: EditorState): DecorationSet {
          return this.getState(state);
        },
      },
    });
  }
}

export default ImageUploadPlaceholderPlugin;
