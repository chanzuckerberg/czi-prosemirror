'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_NodeSpec', {
  value: require('prop-types').shape({
    attrs: require('prop-types').shape({}),
    content: require('prop-types').string,
    draggable: require('prop-types').bool,
    group: require('prop-types').string,
    inline: require('prop-types').bool,
    parseDOM: require('prop-types').arrayOf(require('prop-types').any),
    toDOM: require('prop-types').func
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_MarkSpec', {
  value: require('prop-types').shape({
    attrs: require('prop-types').shape({}),
    parseDOM: require('prop-types').arrayOf(require('prop-types').any).isRequired,
    toDOM: require('prop-types').func.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_EditorProps', {
  value: require('prop-types').shape({})
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DirectEditorProps', {
  value: require('prop-types').shape({})
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RenderCommentProps', {
  value: require('prop-types').shape({
    commentThreadId: require('prop-types').string.isRequired,
    isActive: require('prop-types').bool.isRequired,
    requestCommentThreadDeletion: require('prop-types').func.isRequired,
    requestCommentThreadReflow: require('prop-types').func.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ImageLike', {
  value: require('prop-types').shape({
    height: require('prop-types').number.isRequired,
    id: require('prop-types').string.isRequired,
    src: require('prop-types').string.isRequired,
    width: require('prop-types').number.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_EditorRuntime', {
  value: require('prop-types').shape({
    canProxyImageSrc: require('prop-types').func,
    getProxyImageSrc: require('prop-types').func,
    canUploadImage: require('prop-types').func,
    uploadImage: require('prop-types').func,
    canComment: require('prop-types').func,
    createCommentThreadID: require('prop-types').func,
    renderComment: require('prop-types').func,
    canLoadHTML: require('prop-types').func,
    loadHTML: require('prop-types').func
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_MathValue', {
  value: require('prop-types').shape({
    asciimath: require('prop-types').string,
    latex: require('prop-types').string,
    text: require('prop-types').string,
    xml: require('prop-types').string
  })
});