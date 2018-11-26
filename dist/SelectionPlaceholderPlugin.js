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

exports.showSelectionPlaceholder = showSelectionPlaceholder;
exports.hideSelectionPlaceholder = hideSelectionPlaceholder;

require('./ui/czi-selection-placeholder.css');

var _uuid = require('./ui/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLACE_HOLDER_ID = { name: 'SelectionPlaceholderPlugin' };

var singletonInstance = null;

// https://prosemirror.net/examples/upload/
var SPEC = {
  state: {
    init: function init() {
      return _prosemirrorView.DecorationSet.empty;
    },
    apply: function apply(tr, set) {
      set = set.map(tr.mapping, tr.doc);
      var action = tr.getMeta(this);

      if (!action) {
        return set;
      }

      if (action.add) {
        var deco = _prosemirrorView.Decoration.inline(action.add.from, action.add.to, {
          class: 'czi-selection-placeholder'
        }, {
          id: PLACE_HOLDER_ID
        });
        set = set.add(tr.doc, [deco]);
      } else if (action.remove) {
        var found = set.find(null, null, specFinder);
        set = set.remove(found);
      }

      return set;
    }
  },
  props: {
    decorations: function decorations(state) {
      var plugin = singletonInstance;
      return plugin ? plugin.getState(state) : null;
    }
  }
};

var SelectionPlaceholderPlugin = function (_Plugin) {
  (0, _inherits3.default)(SelectionPlaceholderPlugin, _Plugin);

  function SelectionPlaceholderPlugin() {
    (0, _classCallCheck3.default)(this, SelectionPlaceholderPlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SelectionPlaceholderPlugin.__proto__ || (0, _getPrototypeOf2.default)(SelectionPlaceholderPlugin)).call(this, SPEC));

    if (singletonInstance) {
      var _ret;

      return _ret = singletonInstance, (0, _possibleConstructorReturn3.default)(_this, _ret);
    }
    singletonInstance = _this;
    return _this;
  }

  return SelectionPlaceholderPlugin;
}(_prosemirrorState.Plugin);

function specFinder(spec) {
  return spec.id == PLACE_HOLDER_ID;
}

function findSelectionPlaceholder(state) {
  if (!singletonInstance) {
    return null;
  }
  var decos = singletonInstance.getState(state);
  var found = decos.find(null, null, specFinder);
  var pos = found.length ? found[0] : null;
  return pos || null;
}

function showSelectionPlaceholder(state, tr) {
  tr = tr || state.tr;
  var plugin = singletonInstance;

  if (!plugin || !tr.selection || tr.selection.empty) {
    return tr;
  }

  var deco = findSelectionPlaceholder(state);
  if (deco === null) {
    tr = tr.setMeta(plugin, {
      add: {
        from: tr.selection.from,
        to: tr.selection.to
      }
    });
  }

  return tr;
}

function hideSelectionPlaceholder(state, tr) {
  tr = tr || state.tr;
  var plugin = singletonInstance;
  if (!plugin) {
    return tr;
  }

  var deco = findSelectionPlaceholder(state);
  if (deco) {
    tr = tr.setMeta(plugin, {
      remove: {}
    });
  }

  return tr;
}

exports.default = SelectionPlaceholderPlugin;