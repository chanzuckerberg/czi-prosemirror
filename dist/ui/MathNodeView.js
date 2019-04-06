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

require('./czi-math-view.css');

var _CustomNodeView2 = require('./CustomNodeView');

var _CustomNodeView3 = _interopRequireDefault(_CustomNodeView2);

var _MathInlineEditor = require('./MathInlineEditor');

var _MathInlineEditor2 = _interopRequireDefault(_MathInlineEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createPopUp = require('./createPopUp');

var _createPopUp2 = _interopRequireDefault(_createPopUp);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _renderLaTeXAsHTML = require('./renderLaTeXAsHTML');

var _renderLaTeXAsHTML2 = _interopRequireDefault(_renderLaTeXAsHTML);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _PopUpPosition = require('./PopUpPosition');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_NodeViewProps = require('./CustomNodeView').babelPluginFlowReactPropTypes_proptype_NodeViewProps || require('prop-types').any;

var EMPTY_SRC = 'data:image/gif;base64,' + 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

var MathViewBody = function (_React$PureComponent) {
  (0, _inherits3.default)(MathViewBody, _React$PureComponent);

  function MathViewBody() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MathViewBody);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MathViewBody.__proto__ || (0, _getPrototypeOf2.default)(MathViewBody)).call.apply(_ref, [this].concat(args))), _this), _this._inlineEditor = null, _this._id = (0, _uuid2.default)(), _this._mounted = false, _this._onChange = function (value) {
      if (!_this._mounted) {
        return;
      }

      var align = value ? value.align : null;
      var latex = value ? value.latex : null;

      var _this$props = _this.props,
          getPos = _this$props.getPos,
          node = _this$props.node,
          editorView = _this$props.editorView;

      var pos = getPos();
      var attrs = (0, _extends3.default)({}, node.attrs, {
        latex: latex,
        align: align
      });

      var tr = editorView.state.tr;
      var selection = editorView.state.selection;

      tr = tr.setNodeMarkup(pos, null, attrs);
      tr = tr.setSelection(selection);
      editorView.dispatch(tr);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(MathViewBody, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      this._renderInlineEditor();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this._renderInlineEditor();
    }
  }, {
    key: 'render',
    value: function render() {
      // TODO: Resolve `readOnly`;
      var readOnly = false;
      var _props = this.props,
          node = _props.node,
          selected = _props.selected,
          focused = _props.focused;
      var attrs = node.attrs;
      var latex = attrs.latex;


      var active = focused && !readOnly;
      var className = (0, _classnames2.default)('czi-math-view-body', { active: active, selected: selected });
      var html = (0, _renderLaTeXAsHTML2.default)(latex);
      return _react2.default.createElement(
        'span',
        {
          className: className,
          'data-active': active ? 'true' : null,
          'data-latex': latex || '',
          id: this._id,
          title: latex },
        _react2.default.createElement('img', {
          alt: latex,
          className: 'czi-math-view-body-img',
          src: EMPTY_SRC,
          title: latex
        }),
        _react2.default.createElement('span', {
          className: 'czi-math-view-body-content',
          dangerouslySetInnerHTML: { __html: html }
        })
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
        this._inlineEditor = (0, _createPopUp2.default)(_MathInlineEditor2.default, editorProps, {
          anchor: el,
          autoDismiss: false,
          container: el.closest('.czi-editor-frame-body'),
          position: _PopUpPosition.atAnchorBottomCenter,
          onClose: function onClose() {
            _this2._inlineEditor = null;
          }
        });
      }
    }
  }]);
  return MathViewBody;
}(_react2.default.PureComponent);

var MathNodeView = function (_CustomNodeView) {
  (0, _inherits3.default)(MathNodeView, _CustomNodeView);

  function MathNodeView() {
    (0, _classCallCheck3.default)(this, MathNodeView);
    return (0, _possibleConstructorReturn3.default)(this, (MathNodeView.__proto__ || (0, _getPrototypeOf2.default)(MathNodeView)).apply(this, arguments));
  }

  (0, _createClass3.default)(MathNodeView, [{
    key: 'createDOMElement',


    // @override
    value: function createDOMElement() {
      var el = document.createElement('span');
      el.className = 'czi-math-view';
      this._updateDOM(el);
      return el;
    }

    // @override

  }, {
    key: 'update',
    value: function update(node, decorations) {
      (0, _get3.default)(MathNodeView.prototype.__proto__ || (0, _getPrototypeOf2.default)(MathNodeView.prototype), 'update', this).call(this, node, decorations);
      this._updateDOM(this.dom);
      return true;
    }

    // @override

  }, {
    key: 'renderReactComponent',
    value: function renderReactComponent() {
      return _react2.default.createElement(MathViewBody, this.props);
    }
  }, {
    key: '_updateDOM',
    value: function _updateDOM(el) {
      var align = this.props.node.attrs.align;

      var className = 'czi-math-view';
      if (align) {
        className += ' align-' + align;
      }
      el.className = className;
    }
  }]);
  return MathNodeView;
}(_CustomNodeView3.default);

exports.default = MathNodeView;