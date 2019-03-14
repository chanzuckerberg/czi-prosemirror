'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

exports.uploadImageFiles = uploadImageFiles;

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _uuid = require('./ui/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

require('./ui/czi-image-upload-placeholder.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ImageLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ImageLike || require('prop-types').any;

var IMAGE_FILE_TYLES = new _set2.default(['image/jpeg', 'image/gif', 'image/png', 'image/jpg']);

var TITLE = 'Uploading...';

var INNER_HTML = new Array(4).join('<div class="czi-image-upload-placeholder-child"></div>');

function isImageUploadPlaceholderPlugin(plugin) {
  return plugin instanceof ImageUploadPlaceholderPlugin;
}

function isImageFileType(file) {
  return file && IMAGE_FILE_TYLES.has(file.type);
}

function findImageUploadPlaceholder(placeholderPlugin, state, id) {
  var decos = placeholderPlugin.getState(state);
  var found = decos.find(null, null, function (spec) {
    return spec.id === id;
  });
  return found.length ? found[0].from : null;
}

function defer(fn) {
  return function () {
    setTimeout(fn, 0);
  };
}

function uploadImageFiles(view, files, coords) {
  var runtime = view.runtime,
      state = view.state,
      readOnly = view.readOnly,
      disabled = view.disabled;
  var schema = state.schema,
      plugins = state.plugins;

  if (readOnly || disabled || !runtime || !runtime.canUploadImage) {
    return false;
  }

  var imageType = schema.nodes[_NodeNames.IMAGE];
  if (!imageType) {
    return false;
  }

  var uploadImage = runtime.uploadImage,
      canUploadImage = runtime.canUploadImage;

  if (!uploadImage || !canUploadImage) {
    return false;
  }

  var imageFiles = (0, _from2.default)(files).filter(isImageFileType);
  if (!imageFiles.length) {
    return false;
  }

  var placeholderPlugin = plugins.find(isImageUploadPlaceholderPlugin);
  if (!placeholderPlugin) {
    return false;
  }

  // A fresh object to act as the ID for this upload.
  var id = {
    debugId: 'image_upload_' + (0, _uuid2.default)()
  };

  var uploadNext = defer(function () {
    var ff = (0, _nullthrows2.default)(imageFiles.shift());
    uploadImage(ff).then(function (imageInfo) {
      var pos = findImageUploadPlaceholder(placeholderPlugin, view.state, id);
      var trNext = view.state.tr;
      if (pos && !view.readOnly && !view.disabled) {
        var imageNode = imageType.create(imageInfo);
        trNext = trNext.replaceWith(pos, pos, imageNode);
      } else {
        // Upload was cancelled.
        imageFiles.length = 0;
      }
      if (imageFiles.length) {
        uploadNext();
      } else {
        // Remove the placeholder.
        trNext = trNext.setMeta(placeholderPlugin, { remove: { id: id } });
      }
      view.dispatch(trNext);
    });
  });

  uploadNext();

  var tr = state.tr;

  // Replace the selection with a placeholder

  var from = 0;

  // Adjust the cursor to the dropped position.
  if (coords) {
    var dropPos = view.posAtCoords({
      left: coords.x,
      top: coords.y
    });

    if (!dropPos) {
      return false;
    }

    from = dropPos.pos;
    tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, from, from));
  } else {
    from = tr.selection.to;
    tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, from, from));
  }
  var meta = {
    add: {
      id: id,
      pos: from
    }
  };

  tr = tr.setMeta(placeholderPlugin, meta);
  view.dispatch(tr);
  return true;
}

// https://prosemirror.net/examples/upload/

var ImageUploadPlaceholderPlugin = function (_Plugin) {
  (0, _inherits3.default)(ImageUploadPlaceholderPlugin, _Plugin);

  function ImageUploadPlaceholderPlugin() {
    (0, _classCallCheck3.default)(this, ImageUploadPlaceholderPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (ImageUploadPlaceholderPlugin.__proto__ || (0, _getPrototypeOf2.default)(ImageUploadPlaceholderPlugin)).call(this, {
      state: {
        init: function init() {
          return _prosemirrorView.DecorationSet.empty;
        },
        apply: function apply(tr, set) {
          // Adjust decoration positions to changes made by the transaction
          set = set.map(tr.mapping, tr.doc);
          // See if the transaction adds or removes any placeholders
          var action = tr.getMeta(this);
          if (action && action.add) {
            var el = document.createElement('div');
            el.title = TITLE;
            el.className = 'czi-image-upload-placeholder';
            el.innerHTML = INNER_HTML;

            var deco = _prosemirrorView.Decoration.widget(action.add.pos, el, { id: action.add.id });

            set = set.add(tr.doc, [deco]);
          } else if (action && action.remove) {
            var finder = function finder(spec) {
              return spec.id == action.remove.id;
            };
            set = set.remove(set.find(null, null, finder));
          }
          return set;
        }
      },
      props: {
        decorations: function decorations(state) {
          return this.getState(state);
        }
      }
    }));
  }

  return ImageUploadPlaceholderPlugin;
}(_prosemirrorState.Plugin);

exports.default = ImageUploadPlaceholderPlugin;