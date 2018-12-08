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

exports.showCursorPlaceholder = showCursorPlaceholder;
exports.hideCursorPlaceholder = hideCursorPlaceholder;

require('./ui/czi-cursor-placeholder.css');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLACE_HOLDER_ID = { name: 'CursorPlaceholderPlugin' };

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
        var widget = document.createElement('czi-cursor-placeholder');
        widget.className = 'czi-cursor-placeholder';
        var deco = _prosemirrorView.Decoration.widget(action.add.pos, widget, {
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

var CursorPlaceholderPlugin = function (_Plugin) {
  (0, _inherits3.default)(CursorPlaceholderPlugin, _Plugin);

  function CursorPlaceholderPlugin() {
    (0, _classCallCheck3.default)(this, CursorPlaceholderPlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CursorPlaceholderPlugin.__proto__ || (0, _getPrototypeOf2.default)(CursorPlaceholderPlugin)).call(this, SPEC));

    if (singletonInstance) {
      var _ret;

      return _ret = singletonInstance, (0, _possibleConstructorReturn3.default)(_this, _ret);
    }
    singletonInstance = _this;
    return _this;
  }

  return CursorPlaceholderPlugin;
}(_prosemirrorState.Plugin);

function specFinder(spec) {
  return spec.id === PLACE_HOLDER_ID;
}

function findCursorPlaceholderPos(state) {
  if (!singletonInstance) {
    return null;
  }
  var decos = singletonInstance.getState(state);
  var found = decos.find(null, null, specFinder);
  var pos = found.length ? found[0].from : null;
  return pos || null;
}

function showCursorPlaceholder(state) {
  var plugin = singletonInstance;
  var tr = state.tr;

  if (!plugin || !tr.selection) {
    return tr;
  }

  var pos = findCursorPlaceholderPos(state);
  if (pos === null) {
    if (!tr.selection.empty) {
      // Replace the selection with a placeholder.
      tr = tr.deleteSelection();
    }
    tr = tr.setMeta(plugin, {
      add: {
        pos: tr.selection.from
      }
    });
  }

  return tr;
}

function hideCursorPlaceholder(state) {
  var plugin = singletonInstance;
  var tr = state.tr;

  if (!plugin) {
    return tr;
  }

  var pos = findCursorPlaceholderPos(state);
  if (pos !== null) {
    tr = tr.setMeta(plugin, {
      remove: {}
    });
  }

  return tr;
}

exports.default = CursorPlaceholderPlugin;