// @flow

import nullthrows from 'nullthrows';
import {Plugin} from 'prosemirror-state';
import {EditorState, TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {Decoration, DecorationSet} from 'prosemirror-view';
import {EditorView} from 'prosemirror-view';

import {IMAGE} from './NodeNames';
import uuid from './ui/uuid';

import './ui/czi-image-upload-placeholder.css';

import type {ImageLike} from './Types';

const IMAGE_FILE_TYLES = new Set([
  'image/jpeg',
  'image/gif',
  'image/png',
  'image/jpg',
]);

const TITLE = 'Uploading...';

const INNER_HTML = (new Array(4)).join(
  '<div class="czi-image-upload-placeholder-child"></div>'
);

function isImageUploadPlaceholderPlugin(plugin: Plugin): boolean {
  return plugin instanceof ImageUploadPlaceholderPlugin;
}

function isImageFileType(file: File): boolean {
  return file && IMAGE_FILE_TYLES.has(file.type);
}

function findImageUploadPlaceholder(
  placeholderPlugin: ImageUploadPlaceholderPlugin,
  state: EditorState,
  id: Object,
): ?Decoration {
  const decos = placeholderPlugin.getState(state);
  const found = decos.find(null, null, spec => spec.id === id);
  return found.length ? found[0].from : null;
}

function defer(fn: Function): Function {
  return () => {
    setTimeout(fn, 0);
  };
}

export function uploadImageFiles(
  view: EditorView,
  files: Array<File>,
  coords: ?{x: number, y: number},
): boolean {
  const {runtime, state, readOnly, disabled} = view;
  const {schema, plugins} = state;
  if (readOnly || disabled || !runtime || !runtime.canUploadImage) {
    return false;
  }

  const imageType = schema.nodes[IMAGE];
  if (!imageType) {
    return false;
  }

  const {uploadImage, canUploadImage} = runtime;
  if (!uploadImage || !canUploadImage) {
    return false;
  }

  const imageFiles = Array.from(files).filter(isImageFileType);
  if (!imageFiles.length) {
    return false;
  }

  const placeholderPlugin = plugins.find(isImageUploadPlaceholderPlugin);
  if (!placeholderPlugin) {
    return false;
  }

  // A fresh object to act as the ID for this upload.
  const id = {
    debugId: 'image_upload_' + uuid(),
  };

  const uploadNext = defer(() => {
    const ff = nullthrows(imageFiles.shift());
    uploadImage(ff).then((imageInfo: ImageLike) => {
      const pos = findImageUploadPlaceholder(
        placeholderPlugin,
        view.state,
        id,
      );
      let trNext = view.state.tr;
      if (pos && !view.readOnly && !view.disabled) {
        const imageNode = imageType.create(imageInfo);
        trNext = trNext.replaceWith(pos, pos, imageNode);
      } else {
        // Upload was cancelled.
        imageFiles.length = 0;
      }
      if (imageFiles.length) {
        uploadNext();
      } else {
        // Remove the placeholder.
        trNext = trNext.setMeta(placeholderPlugin, {remove: {id}});
      }
      view.dispatch(trNext);
    });
  });

  uploadNext();

  let {tr} = state;

  // Replace the selection with a placeholder
  let from = 0;

   // Adjust the cursor to the dropped position.
  if (coords) {
    const dropPos = view.posAtCoords({
      left: coords.x,
      top: coords.y,
    });

    if (!dropPos) {
      return false;
    }

    from = dropPos.pos;
    tr = tr.setSelection(TextSelection.create(
      tr.doc,
      from,
      from,
    ));
  } else {
    from = tr.selection.to;
    tr = tr.setSelection(TextSelection.create(
      tr.doc,
      from,
      from,
    ));
  }
  const meta = {
    add: {
      id,
      pos: from,
    },
  };

  tr = tr.setMeta(placeholderPlugin, meta);
  view.dispatch(tr);
  return true;
}

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
            el.title = TITLE;
            el.className = 'czi-image-upload-placeholder';
            el.innerHTML = INNER_HTML;

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
