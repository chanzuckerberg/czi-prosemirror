'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorView = require('prosemirror-view');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _CustomNodeView2 = require('./CustomNodeView');

var _CustomNodeView3 = _interopRequireDefault(_CustomNodeView2);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _ImageInlineEditor = require('./ImageInlineEditor');

var _ImageInlineEditor2 = _interopRequireDefault(_ImageInlineEditor);

var _ImageResizeBox = require('./ImageResizeBox');

var _ImageResizeBox2 = _interopRequireDefault(_ImageResizeBox);

var _PopUpPosition = require('./PopUpPosition');

var _ResizeObserver = require('./ResizeObserver');

var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);

var _createPopUp = require('./createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _resolveImage = require('./resolveImage');

var _resolveImage2 = _interopRequireDefault(_resolveImage);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

require('./czi-image-view.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_EditorRuntime = require('../Types').babelPluginFlowReactPropTypes_proptype_EditorRuntime || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_NodeViewProps = require('./CustomNodeView').babelPluginFlowReactPropTypes_proptype_NodeViewProps || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry = require('./ResizeObserver').babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry || require('prop-types').any;

var EMPTY_SRC = 'data:image/gif;base64,' + 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/* This value must be synced with the margin defined at .czi-image-view */
var IMAGE_MARGIN = 2;

var MAX_SIZE = 100000;
var IMAGE_PLACEHOLDER_SIZE = 24;

var DEFAULT_ORIGINAL_SIZE = {
  src: '',
  complete: false,
  height: 0,
  width: 0
};

// Get the maxWidth that the image could be resized to.
function getMaxResizeWidth(el) {
  // Ideally, the image should bot be wider then its containing element.
  var node = el.parentElement;
  while (node && !node.offsetParent) {
    node = node.parentElement;
  }
  if (node && node.offsetParent && node.offsetParent.offsetWidth && node.offsetParent.offsetWidth > 0) {
    var _node = node,
        offsetParent = _node.offsetParent;

    var style = el.ownerDocument.defaultView.getComputedStyle(offsetParent);
    var width = offsetParent.clientWidth - IMAGE_MARGIN * 2;
    if (style.boxSizing === 'border-box') {
      var pl = parseInt(style.paddingLeft, 10);
      var pr = parseInt(style.paddingRight, 10);
      width -= pl + pr;
    }
    return Math.max(width, _ImageResizeBox.MIN_SIZE);
  }
  // Let the image resize freely.
  return MAX_SIZE;
}

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
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageViewBody);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageViewBody.__proto__ || (0, _getPrototypeOf2.default)(ImageViewBody)).call.apply(_ref, [this].concat(args))), _this), _this._body = null, _this._id = (0, _uuid2.default)(), _this._inlineEditor = null, _this._mounted = false, _this.state = {
      maxSize: {
        width: MAX_SIZE,
        height: MAX_SIZE,
        complete: false
      },
      originalSize: DEFAULT_ORIGINAL_SIZE
    }, _this._resolveOriginalSize = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var src, url, originalSize;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_this._mounted) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return');

            case 2:

              _this.setState({ originalSize: DEFAULT_ORIGINAL_SIZE });
              src = _this.props.node.attrs.src;
              url = resolveURL(_this.props.editorView.runtime, src);
              _context.next = 7;
              return (0, _resolveImage2.default)(url);

            case 7:
              originalSize = _context.sent;

              if (_this._mounted) {
                _context.next = 10;
                break;
              }

              return _context.abrupt('return');

            case 10:
              if (!(_this.props.node.attrs.src !== src)) {
                _context.next = 12;
                break;
              }

              return _context.abrupt('return');

            case 12:

              if (!originalSize.complete) {
                originalSize.width = _ImageResizeBox.MIN_SIZE;
                originalSize.height = _ImageResizeBox.MIN_SIZE;
              }
              _this.setState({ originalSize: originalSize });

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this._onKeyDown = function (e) {
      console.log(e.keyCode);
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
    }, _this._onBodyRef = function (ref) {
      if (ref) {
        _this._body = ref;
        // Mounting
        var el = _reactDom2.default.findDOMNode(ref);
        if (el instanceof HTMLElement) {
          _ResizeObserver2.default.observe(el, _this._onBodyResize);
        }
      } else {
        // Unmounting.
        var _el = _this._body && _reactDom2.default.findDOMNode(_this._body);
        if (_el instanceof HTMLElement) {
          _ResizeObserver2.default.unobserve(_el);
        }
        _this._body = null;
      }
    }, _this._onBodyResize = function (info) {
      var width = _this._body ? getMaxResizeWidth(_reactDom2.default.findDOMNode(_this._body)) : MAX_SIZE;

      _this.setState({
        maxSize: {
          width: width,
          height: MAX_SIZE,
          complete: !!_this._body
        }
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ImageViewBody, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      this._resolveOriginalSize();
      this._renderInlineEditor();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
      this._inlineEditor && this._inlineEditor.close();
      this._inlineEditor = null;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var prevSrc = prevProps.node.attrs.src;
      var node = this.props.node;
      var src = node.attrs.src;

      if (prevSrc !== src) {
        // A new image is provided, resolve it.
        this._resolveOriginalSize();
      }
      this._renderInlineEditor();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          originalSize = _state.originalSize,
          maxSize = _state.maxSize;
      var _props = this.props,
          editorView = _props.editorView,
          node = _props.node,
          selected = _props.selected,
          focused = _props.focused;
      var readOnly = editorView.readOnly;
      var attrs = node.attrs;
      var align = attrs.align,
          crop = attrs.crop,
          rotate = attrs.rotate;

      // It's only active when the image's fully loaded.

      var loading = originalSize === DEFAULT_ORIGINAL_SIZE;
      var active = !loading && focused && !readOnly && originalSize.complete;
      var src = originalSize.complete ? originalSize.src : EMPTY_SRC;
      var aspectRatio = loading ? 1 : originalSize.width / originalSize.height;
      var error = !loading && originalSize.src && !originalSize.complete;

      var width = attrs.width,
          height = attrs.height;


      if (loading) {
        width = width || IMAGE_PLACEHOLDER_SIZE;
        height = height || IMAGE_PLACEHOLDER_SIZE;
      }

      if (width && !height) {
        height = width / aspectRatio;
      } else if (height && !width) {
        width = height * aspectRatio;
      } else if (!width && !height) {
        width = originalSize.width;
        height = originalSize.height;
      }

      var scale = 1;
      if (width > maxSize.width && (!crop || crop.width > maxSize.width)) {
        // Scale image to fit its containing space.
        // If the image is not cropped.
        width = maxSize.width;
        height = width / aspectRatio;
        scale = maxSize.width / width;
      }

      var className = (0, _classnames2.default)('czi-image-view-body', {
        active: active,
        error: error,
        focused: focused,
        loading: loading,
        selected: selected
      });

      var resizeBox = active && !crop && !rotate ? _react2.default.createElement(_ImageResizeBox2.default, {
        height: height,
        onResizeEnd: this._onResizeEnd,
        src: src,
        width: width
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
        var cropped = (0, _extends3.default)({}, crop);
        if (scale !== 1) {
          scale = maxSize.width / cropped.width;
          cropped.width *= scale;
          cropped.height *= scale;
          cropped.left *= scale;
          cropped.top *= scale;
        }
        clipStyle.width = cropped.width + 'px';
        clipStyle.height = cropped.height + 'px';
        imageStyle.left = cropped.left + 'px';
        imageStyle.top = cropped.top + 'px';
      }

      if (rotate) {
        clipStyle.transform = 'rotate(' + rotate + 'rad)';
      }

      var errorView = error ? _Icon2.default.get('error') : null;
      var errorTitle = error ? 'Unable to load image from ' + (attrs.src || '') : undefined;

      return _react2.default.createElement(
        'span',
        {
          className: className,
          'data-active': active ? 'true' : undefined,
          'data-original-src': String(attrs.src),
          id: this._id,
          onKeyDown: this._onKeyDown,
          ref: this._onBodyRef,
          title: errorTitle },
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
              id: this._id + '-img',
              src: src,
              width: width
            }),
            errorView
          )
        ),
        resizeBox
      );
    }
  }, {
    key: '_renderInlineEditor',
    value: function _renderInlineEditor() {
      var _this3 = this;

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
            _this3._inlineEditor = null;
          }
        });
      }
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
      console.log('created');
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