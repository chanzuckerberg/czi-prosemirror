'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SelectionObserver = require('./SelectionObserver');

var _SelectionObserver2 = _interopRequireDefault(_SelectionObserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Standard className for selected node.
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_NodeViewProps', {
  value: require('prop-types').shape({
    editorView: require('prop-types').any.isRequired,
    getPos: require('prop-types').func.isRequired,
    node: require('prop-types').any.isRequired,
    selected: require('prop-types').bool.isRequired,
    focused: require('prop-types').bool.isRequired
  })
}); // @xflow

var SELECTED_NODE_CLASS_NAME = 'ProseMirror-selectednode';

var mountedViews = new _set2.default();
var pendingViews = new _set2.default();

function onMutation(mutations, observer) {
  var root = document.body;
  if (!root) {
    return;
  }

  var mountingViews = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(pendingViews), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var view = _step.value;

      var el = view.dom;
      if (root.contains(el)) {
        pendingViews.delete(view);
        mountingViews.push(view);
        view.__renderReactComponent();
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(mountedViews), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _view = _step2.value;

      var el = _view.dom;
      if (!root.contains(el)) {
        mountedViews.delete(el);
        _reactDom2.default.unmountComponentAtNode(el);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  mountingViews.forEach(function (view) {
    return mountedViews.add(view);
  });

  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}

// Workaround to get in-selection views selected.
// See https://discuss.prosemirror.net/t/copy-selection-issue-with-the-image-node/1673/2;
function onSelection(entries, observer) {
  if (!window.getSelection) {
    console.warn('window.getSelection() is not supported');
    observer.disconnect();
    return;
  }

  var selection = window.getSelection();
  if (!selection.containsNode) {
    console.warn('selection.containsNode() is not supported');
    observer.disconnect();
    return;
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = (0, _getIterator3.default)(mountedViews), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var view = _step3.value;

      var el = view.dom;
      if (selection.containsNode(el)) {
        view.selectNode();
      } else {
        view.deselectNode();
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}

var selectionObserver = new _SelectionObserver2.default(onSelection);
var mutationObserver = new MutationObserver(onMutation);

// This implements the `NodeView` interface and renders a Node with a react
// Component.
// https://prosemirror.net/docs/ref/#view.NodeView
// https://github.com/ProseMirror/prosemirror-view/blob/master/src/viewdesc.js#L429

var CustomNodeView = function () {
  function CustomNodeView(node, editorView, getPos, decorations) {
    (0, _classCallCheck3.default)(this, CustomNodeView);


    this.props = {
      decorations: decorations,
      editorView: editorView,
      getPos: getPos,
      node: node,
      selected: false,
      focused: false
    };

    pendingViews.add(this);

    // The editor will use this as the node's DOM representation
    var dom = this.createDOMElement();
    this.dom = dom;
    dom.onClick = this._onClick;

    if (pendingViews.size === 1) {
      mutationObserver.observe(document, { childList: true, subtree: true });
      selectionObserver.observe(document);
    }
  }

  (0, _createClass3.default)(CustomNodeView, [{
    key: 'update',
    value: function update(node, decorations) {
      this.props = (0, _extends3.default)({}, this.props, {
        node: node
      });
      this.__renderReactComponent();
      return true;
    }
  }, {
    key: 'stopEvent',
    value: function stopEvent() {
      return false;
    }

    // Mark this node as being the selected node.

  }, {
    key: 'selectNode',
    value: function selectNode() {
      this._selected = true;
      this.dom.classList.add(SELECTED_NODE_CLASS_NAME);
      this.__renderReactComponent();
    }

    // Remove selected node marking from this node.

  }, {
    key: 'deselectNode',
    value: function deselectNode() {
      this._selected = false;
      this.dom.classList.remove(SELECTED_NODE_CLASS_NAME);
      this.__renderReactComponent();
    }

    // This should be overwrite by subclass.

  }, {
    key: 'createDOMElement',
    value: function createDOMElement() {
      // The editor will use this as the node's DOM representation.
      // return document.createElement('span');
      throw new Error('not implemented');
    }

    // This should be overwrite by subclass.

  }, {
    key: 'renderReactComponent',
    value: function renderReactComponent() {
      // return <CustomNodeViewComponent {...this.props} />;
      throw new Error('not implemented');
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // Called when the node view is removed from the editor or the whole
      // editor is destroyed.
      // sub-class may override this method.
    }
  }, {
    key: '__renderReactComponent',
    value: function __renderReactComponent() {
      var _props = this.props,
          editorView = _props.editorView,
          getPos = _props.getPos;


      if (editorView.state && editorView.state.selection) {
        var from = editorView.state.selection.from;

        var pos = getPos();
        this.props.selected = this._selected;
        this.props.focused = editorView.focused && pos === from;
      } else {
        this.props.selected = false;
        this.props.focused = false;
      }

      _reactDom2.default.render(this.renderReactComponent(), this.dom);
    }
  }]);
  return CustomNodeView;
}();

exports.default = CustomNodeView;