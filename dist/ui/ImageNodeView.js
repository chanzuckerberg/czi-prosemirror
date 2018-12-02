'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

require('./czi-image-view.css');

var _CustomNodeView2 = require('./CustomNodeView');

var _CustomNodeView3 = _interopRequireDefault(_CustomNodeView2);

var _ImageInlineEditor = require('./ImageInlineEditor');

var _ImageInlineEditor2 = _interopRequireDefault(_ImageInlineEditor);

var _ImageResizeBox = require('./ImageResizeBox');

var _ImageResizeBox2 = _interopRequireDefault(_ImageResizeBox);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createPopUp = require('./createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _resolveImage2 = require('./resolveImage');

var _resolveImage3 = _interopRequireDefault(_resolveImage2);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _PopUpPosition = require('./PopUpPosition');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_EditorRuntime = require('../Types').babelPluginFlowReactPropTypes_proptype_EditorRuntime || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_NodeViewProps = require('./CustomNodeView').babelPluginFlowReactPropTypes_proptype_NodeViewProps || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ImageInlineEditorValue = require('./ImageInlineEditor').babelPluginFlowReactPropTypes_proptype_ImageInlineEditorValue || require('prop-types').any;

var EMPTY_SRC = 'data:image/gif;base64,' + 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function resolveURL(runtime, src) {
  if (!runtime) {
    return src;
  }
  var canProxyImageSrc = runtime.canProxyImageSrc,
      getProxyImageSrc = runtime.getProxyImageSrc;

  if (src && canProxyImageSrc && getProxyImageSrc && canProxyImageSrc(src)) {
    return getProxyImageSrc(src);
  }
  return src;
}

var ImageViewBody = function (_React$PureComponent) {
  (0, _inherits3.default)(ImageViewBody, _React$PureComponent);

  function ImageViewBody() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageViewBody);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageViewBody.__proto__ || (0, _getPrototypeOf2.default)(ImageViewBody)).call.apply(_ref, [this].concat(args))), _this), _this._inlineEditor = null, _this._id = (0, _uuid2.default)(), _this._mounted = false, _this.state = {
      resolvedImage: null
    }, _this._onResizeEnd = function (width, height) {
      var _this$props = _this.props,
          getPos = _this$props.getPos,
          node = _this$props.node,
          editorView = _this$props.editorView;

      var pos = getPos();
      var attrs = (0, _extends3.default)({}, node.attrs, {
        // TODO: Support UI for cropping later.
        crop: null,
        width: width,
        height: height
      });

      var tr = editorView.state.tr;
      var selection = editorView.state.selection;

      tr = tr.setNodeMarkup(pos, null, attrs);
      tr = tr.setSelection(selection);
      editorView.dispatch(tr);
    }, _this._onChange = function (value) {
      if (!_this._mounted) {
        return;
      }

      var align = value ? value.align : null;

      var _this$props2 = _this.props,
          getPos = _this$props2.getPos,
          node = _this$props2.node,
          editorView = _this$props2.editorView;

      var pos = getPos();
      var attrs = (0, _extends3.default)({}, node.attrs, {
        align: align
      });

      var tr = editorView.state.tr;
      var selection = editorView.state.selection;

      tr = tr.setNodeMarkup(pos, null, attrs);
      tr = tr.setSelection(selection);
      editorView.dispatch(tr);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ImageViewBody, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      this._resolveImage();
      this._renderInlineEditor();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
      this._inlineEditor && this._inlineEditor.close();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var resolvedImage = this.state.resolvedImage;

      var prevSrc = prevProps.node.attrs.src;
      var _props = this.props,
          editorView = _props.editorView,
          node = _props.node;
      var _node$attrs = node.attrs,
          src = _node$attrs.src,
          width = _node$attrs.width,
          height = _node$attrs.height,
          align = _node$attrs.align;


      if (prevSrc !== src) {
        // A new image is provided, resolve it.
        this._resolveImage();
        return;
      }

      if (resolvedImage && resolvedImage.complete && (resolvedImage.width !== width || resolvedImage.height !== height) && width && height) {
        // Image is resized.
        this.setState({
          resolvedImage: (0, _extends3.default)({}, resolvedImage, {
            width: width,
            height: height
          })
        });
      }

      this._renderInlineEditor();
    }
  }, {
    key: 'render',
    value: function render() {
      // TODO: Resolve `readOnly`;
      var readOnly = false;
      var _props2 = this.props,
          node = _props2.node,
          selected = _props2.selected;
      var resolvedImage = this.state.resolvedImage;
      var attrs = node.attrs;
      var align = attrs.align,
          crop = attrs.crop;


      var active = selected && !readOnly && resolvedImage && resolvedImage.complete;

      var src = resolvedImage && resolvedImage.complete ? resolvedImage.src : attrs.src || EMPTY_SRC;

      var width = resolvedImage && resolvedImage.complete ? resolvedImage.width : attrs.width || _ImageResizeBox.MIN_SIZE;

      var height = resolvedImage && resolvedImage.complete ? resolvedImage.height : attrs.height || _ImageResizeBox.MIN_SIZE;

      var error = resolvedImage && !resolvedImage.complete;
      var loading = !_resolveImage3.default;

      var className = (0, _classnames2.default)('czi-image-view-body', {
        active: active,
        error: error,
        loading: loading
      });

      var resizeBox = active ? _react2.default.createElement(_ImageResizeBox2.default, {
        height: height,
        onResizeEnd: this._onResizeEnd,
        width: width,
        src: src
      }) : null;

      var imageStyle = {
        display: 'inline-block',
        height: height + 'px',
        left: '0',
        top: '0',
        width: width + 'px',
        position: 'relative'
      };

      var clipStyle = {};

      if (crop) {
        clipStyle.width = crop.width;
        clipStyle.height = crop.height;
        imageStyle.left = crop.left + 'px';
        imageStyle.top = crop.top + 'px';
      }

      return _react2.default.createElement(
        'span',
        {
          className: className,
          'data-active': active ? 'true' : null,
          'data-src': src || '',
          id: this._id },
        _react2.default.createElement(
          'span',
          {
            className: 'czi-image-view-body-img-clip', style: clipStyle },
          _react2.default.createElement(
            'span',
            { style: imageStyle },
            _react2.default.createElement('img', {
              alt: '',
              className: 'czi-image-view-body-img',
              'data-align': align,
              height: height,
              src: src || EMPTY_SRC,
              width: width
            })
          )
        ),
        resizeBox
      );
    }
  }, {
    key: '_renderInlineEditor',
    value: function _renderInlineEditor() {
      var _this2 = this;

      var el = document.getElementById(this._id);
      if (!el || el.getAttribute('data-active') !== 'true') {
        this._inlineEditor && this._inlineEditor.close();
        return;
      }

      var node = this.props.node;

      var editorProps = {
        value: node.attrs,
        onSelect: this._onChange
      };
      if (this._inlineEditor) {
        this._inlineEditor.update(editorProps);
      } else {
        this._inlineEditor = (0, _createPopUp2.default)(_ImageInlineEditor2.default, editorProps, {
          anchor: el,
          autoDismiss: false,
          position: _PopUpPosition.atAnchorBottomCenter,
          onClose: function onClose() {
            _this2._inlineEditor = null;
          }
        });
      }
    }
  }, {
    key: '_resolveImage',
    value: function _resolveImage() {
      var _this3 = this;

      this.setState({ resolveImage: null });
      var _props3 = this.props,
          editorView = _props3.editorView,
          node = _props3.node;
      var src = this.props.node.attrs.src;

      var url = resolveURL(editorView.runtime, src);
      (0, _resolveImage3.default)(url).then(function (resolvedImage) {
        if (_this3._mounted && src === _this3.props.node.attrs.src) {
          _this3._mounted && _this3.setState({ resolvedImage: resolvedImage });
        }
      });
    }
  }]);
  return ImageViewBody;
}(_react2.default.PureComponent);

var ImageNodeView = function (_CustomNodeView) {
  (0, _inherits3.default)(ImageNodeView, _CustomNodeView);

  function ImageNodeView() {
    (0, _classCallCheck3.default)(this, ImageNodeView);
    return (0, _possibleConstructorReturn3.default)(this, (ImageNodeView.__proto__ || (0, _getPrototypeOf2.default)(ImageNodeView)).apply(this, arguments));
  }

  (0, _createClass3.default)(ImageNodeView, [{
    key: 'createDOMElement',


    // @override
    value: function createDOMElement() {
      var el = document.createElement('span');
      el.className = 'czi-image-view';
      this._updateDOM(el);
      return el;
    }

    // @override

  }, {
    key: 'update',
    value: function update(node, decorations) {
      (0, _get3.default)(ImageNodeView.prototype.__proto__ || (0, _getPrototypeOf2.default)(ImageNodeView.prototype), 'update', this).call(this, node, decorations);
      this._updateDOM(this.dom);
      return true;
    }

    // @override

  }, {
    key: 'renderReactComponent',
    value: function renderReactComponent() {
      return _react2.default.createElement(ImageViewBody, this.props);
    }
  }, {
    key: '_updateDOM',
    value: function _updateDOM(el) {
      var align = this.props.node.attrs.align;

      var className = 'czi-image-view';
      if (align) {
        className += ' align-' + align;
      }
      el.className = className;
    }
  }]);
  return ImageNodeView;
}(_CustomNodeView3.default);

exports.default = ImageNodeView;