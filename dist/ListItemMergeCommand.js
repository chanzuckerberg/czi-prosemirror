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

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _nodeAt = require('./nodeAt');

var _nodeAt2 = _interopRequireDefault(_nodeAt);

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeListItemUp(tr, schema) {
  // This merge a list item to is previous list item of the selection is at the
  // beginning of the list item.
  var _tr = tr,
      selection = _tr.selection;

  if (!selection) {
    return tr;
  }
  var nodeType = schema.nodes[_NodeNames.LIST_ITEM];
  if (!nodeType) {
    return tr;
  }
  var from = selection.from,
      empty = selection.empty;

  if (!empty) {
    // Selection is collapsed.
    return tr;
  }
  var result = (0, _prosemirrorUtils.findParentNodeOfType)(nodeType)(selection);
  if (!result) {
    return tr;
  }
  var pos = result.pos,
      node = result.node;

  if (from !== pos + 2) {
    // Selection is not at the begining of the list item.
    return tr;
  }
  var $pos = tr.doc.resolve(pos);
  var prevNode = $pos.nodeBefore;
  if (!prevNode || prevNode.type !== nodeType) {
    return tr;
  }
  if (node.childCount !== 1) {
    // list item should only have one child (paragraph).
    return tr;
  }

  var paragraphNode = node.firstChild;
  var textNode = schema.text(' ');

  // Delete the list item
  tr = tr.delete(pos - 2, pos + node.nodeSize);
  // Append extra space character to its previous list item.
  tr = tr.insert(pos - 2, _prosemirrorModel.Fragment.from(textNode));
  // Move the content to its previous list item.
  tr = tr.insert(pos - 1, _prosemirrorModel.Fragment.from(paragraphNode.content));
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, pos - 1, pos - 1));
  return tr;
}

function mergeListItemDown(tr, schema) {
  // This merge a list item to is next list item of the selection is at the
  // beginning of the list item.
  var _tr2 = tr,
      selection = _tr2.selection;

  if (!selection) {
    return tr;
  }
  var listItem = schema.nodes[_NodeNames.LIST_ITEM];
  if (!listItem) {
    return tr;
  }
  var from = selection.from,
      empty = selection.empty;

  if (!empty) {
    // Selection is collapsed.
    return tr;
  }
  var result = (0, _prosemirrorUtils.findParentNodeOfType)(listItem)(selection);
  if (!result) {
    return tr;
  }
  var pos = result.pos,
      node = result.node;

  if (from !== pos + node.content.size) {
    // Selection is not at the begining of the list item.
    return tr;
  }

  var $pos = tr.doc.resolve(pos);
  var list = $pos.parent.type;
  var listResult = (0, _prosemirrorUtils.findParentNodeOfType)(list)(selection);
  if (!listResult) {
    return tr;
  }
  var nextFrom = pos + node.nodeSize;
  var nextNode = (0, _nodeAt2.default)(tr.doc, nextFrom);
  var deleteFrom = nextFrom;
  if (listResult.start + listResult.node.content.size === nextFrom) {
    // It's at the end of the last list item. It shall bring the content of the
    // block after the list.
    nextNode = (0, _nodeAt2.default)(tr.doc, nextFrom + 1);
    deleteFrom += 1;
  }

  if (!nextNode) {
    return tr;
  }

  var nextContent = void 0;

  switch (nextNode.type) {
    case listItem:
      // List item should only have one child (paragraph).
      var paragraphNode = (0, _nullthrows2.default)(nextNode.firstChild);
      nextContent = _prosemirrorModel.Fragment.from(paragraphNode.content);
      break;

    case schema.nodes[_NodeNames.HEADING]:
    case schema.nodes[_NodeNames.PARAGRAPH]:
      // Will bring in the content of the next block.
      nextContent = _prosemirrorModel.Fragment.from(nextNode.content);
      break;
  }

  if (!nextContent) {
    return tr;
  }

  var textNode = schema.text(' ');
  // Delete the next node.
  tr = tr.delete(deleteFrom, deleteFrom + nextNode.nodeSize);
  // Append extra space character to its previous list item.
  tr = tr.insert(nextFrom - 2, nextContent);
  // Move the content to the list item.
  tr = tr.insert(nextFrom - 2, _prosemirrorModel.Fragment.from(textNode));
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, nextFrom - 2, nextFrom - 2));
  return tr;
}

var ListItemMergeCommand = function (_UICommand) {
  (0, _inherits3.default)(ListItemMergeCommand, _UICommand);

  function ListItemMergeCommand(direction) {
    (0, _classCallCheck3.default)(this, ListItemMergeCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ListItemMergeCommand.__proto__ || (0, _getPrototypeOf2.default)(ListItemMergeCommand)).call(this));

    _initialiseProps.call(_this);

    _this._direction = direction;
    return _this;
  }

  return ListItemMergeCommand;
}(_UICommand3.default);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._direction = '';

  this.isActive = function (state) {
    return false;
  };

  this.execute = function (state, dispatch, view) {
    var selection = state.selection,
        schema = state.schema;
    var tr = state.tr;

    var direction = _this2._direction;
    if (direction === 'down') {
      tr = mergeListItemDown(tr.setSelection(selection), schema);
    } else if (direction === 'up') {
      tr = mergeListItemUp(tr.setSelection(selection), schema);
    }

    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  };
};

exports.default = ListItemMergeCommand;