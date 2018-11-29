'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

require('./czi-form.css');

require('./czi-image-upload-editor.css');

var _CustomButton = require('./CustomButton');

var _CustomButton2 = _interopRequireDefault(_CustomButton);

var _LoadingIndicator = require('./LoadingIndicator');

var _LoadingIndicator2 = _interopRequireDefault(_LoadingIndicator);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _resolveImage = require('./resolveImage');

var _resolveImage2 = _interopRequireDefault(_resolveImage);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ImageLike = require('../Types').babelPluginFlowReactPropTypes_proptype_ImageLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_EditorRuntime = require('../Types').babelPluginFlowReactPropTypes_proptype_EditorRuntime || require('prop-types').any;

var ImageUploadEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(ImageUploadEditor, _React$PureComponent);

  function ImageUploadEditor() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ImageUploadEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ImageUploadEditor.__proto__ || (0, _getPrototypeOf2.default)(ImageUploadEditor)).call.apply(_ref, [this].concat(args))), _this), _this._img = null, _this._unmounted = false, _this.state = {
      error: null,
      id: (0, _uuid2.default)(),
      pending: false,
      validValue: null
    }, _this._onSelectFile = function (event) {
      var file = event.target.files && event.target.files[0];
      if (file && (typeof file === 'undefined' ? 'undefined' : (0, _typeof3.default)(file)) === 'object') {
        _this._upload(file);
      }
    }, _this._onSuccess = function (image) {
      if (_this._unmounted) {
        return;
      }
      _this.props.close(image);
    }, _this._onError = function (error) {
      if (_this._unmounted) {
        return;
      }
      _this.setState({
        error: error,
        id: (0, _uuid2.default)(),
        pending: false,
        validValue: null
      });
    }, _this._upload = function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file) {
        var _runtime, canUploadImage, uploadImage, image;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _runtime = _this.props.runtime || {};
                canUploadImage = _runtime.canUploadImage, uploadImage = _runtime.uploadImage;

                if (!(!canUploadImage || !uploadImage || !canUploadImage())) {
                  _context.next = 5;
                  break;
                }

                throw new Error('feature is not available');

              case 5:
                _this.setState({ pending: true, error: null });
                _context.next = 8;
                return uploadImage(file);

              case 8:
                image = _context.sent;

                _this._onSuccess(image);
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](0);

                _this._onError(_context.t0);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[0, 12]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this._cancel = function () {
      _this.props.close();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ImageUploadEditor, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          validValue = _state.validValue,
          id = _state.id,
          error = _state.error,
          pending = _state.pending;

      var className = (0, _classnames2.default)('czi-image-upload-editor', { pending: pending, error: error });
      var label = 'Choose a image file...';

      if (pending) {
        label = _react2.default.createElement(_LoadingIndicator2.default, null);
      } else if (error) {
        label = 'Something went wrong, please try again';
      }

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(
          'form',
          { className: 'czi-form' },
          _react2.default.createElement(
            'fieldset',
            null,
            _react2.default.createElement(
              'legend',
              null,
              'Upload Image'
            ),
            _react2.default.createElement(
              'div',
              { className: 'czi-image-upload-editor-body' },
              _react2.default.createElement(
                'div',
                { className: 'czi-image-upload-editor-label' },
                label
              ),
              _react2.default.createElement('input', {
                accept: 'image/png,image/gif,image/jpeg,image/jpg',
                className: 'czi-image-upload-editor-input',
                disabled: pending,
                id: id,
                key: id,
                onChange: this._onSelectFile,
                type: 'file'
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'czi-form-buttons' },
            _react2.default.createElement(_CustomButton2.default, {
              label: 'Cancel',
              onClick: this._cancel
            })
          )
        )
      );
    }
  }]);
  return ImageUploadEditor;
}(_react2.default.PureComponent);

exports.default = ImageUploadEditor;