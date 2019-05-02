'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFromDOMElement;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _DocNodeSpec = require('./DocNodeSpec');

var _EditorPlugins = require('./EditorPlugins');

var _EditorPlugins2 = _interopRequireDefault(_EditorPlugins);

var _EditorSchema = require('./EditorSchema');

var _EditorSchema2 = _interopRequireDefault(_EditorSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromDOMElement(el, schema, plugins) {
  var effectiveSchema = schema || _EditorSchema2.default;
  var effectivePlugins = plugins || _EditorPlugins2.default;
  var bodyEl = el.querySelector('body');

  // https://prosemirror.net/docs/ref/#model.ParseOptions.preserveWhitespace
  var doc = _prosemirrorModel.DOMParser.fromSchema(effectiveSchema).parse(el, {
    preserveWhitespace: true
  });

  if (bodyEl) {
    // Unfortunately the root node `doc` does not supoort `parseDOM`, thus
    // we'd have to assign its `attrs` manually.
    doc.attrs = (0, _DocNodeSpec.getAttrs)(bodyEl);
  }

  return _prosemirrorState.EditorState.create({
    doc: doc,
    plugins: effectivePlugins
  });
}