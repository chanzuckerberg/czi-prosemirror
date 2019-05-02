'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PopUpManager = require('./PopUpManager');

var _PopUpManager2 = _interopRequireDefault(_PopUpManager);

var _PopUpPosition = require('./PopUpPosition');

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_PopUpDetails = require('./PopUpManager').babelPluginFlowReactPropTypes_proptype_PopUpDetails || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_Rect = require('./rects').babelPluginFlowReactPropTypes_proptype_Rect || require('prop-types').any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_PopUpParams', {
  value: require('prop-types').shape({
    anchor: require('prop-types').any,
    autoDismiss: require('prop-types').bool,
    container: require('prop-types').any,
    modal: require('prop-types').bool,
    onClose: require('prop-types').func,
    position: require('prop-types').func
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_PopUpProps', {
  value: require('prop-types').shape({
    View: require('prop-types').func.isRequired,
    close: require('prop-types').func.isRequired,
    popUpParams: require('prop-types').shape({
      anchor: require('prop-types').any,
      autoDismiss: require('prop-types').bool,
      container: require('prop-types').any,
      modal: require('prop-types').bool,
      onClose: require('prop-types').func,
      position: require('prop-types').func
    }).isRequired,
    viewProps: require('prop-types').object.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_PopUpHandle', {
  value: require('prop-types').shape({
    close: require('prop-types').func.isRequired,
    update: require('prop-types').func.isRequired
  })
});

var PopUp = function (_React$PureComponent) {
  (0, _inherits3.default)(PopUp, _React$PureComponent);

  function PopUp() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PopUp);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PopUp.__proto__ || (0, _getPrototypeOf2.default)(PopUp)).call.apply(_ref, [this].concat(args))), _this), _this._bridge = null, _this._id = (0, _uuid2.default)(), _this._getDetails = function () {
      var _this$props = _this.props,
          close = _this$props.close,
          popUpParams = _this$props.popUpParams;
      var anchor = popUpParams.anchor,
          autoDismiss = popUpParams.autoDismiss,
          position = popUpParams.position,
          modal = popUpParams.modal;

      return {
        anchor: anchor,
        autoDismiss: autoDismiss === false ? false : true,
        body: document.getElementById(_this._id),
        close: close,
        modal: modal === true,
        position: position || (modal ? _PopUpPosition.atViewportCenter : _PopUpPosition.atAnchorBottomLeft)
      };
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(PopUp, [{
    key: 'render',
    value: function render() {
      var dummy = {};
      var _props = this.props,
          View = _props.View,
          viewProps = _props.viewProps,
          close = _props.close;

      return _react2.default.createElement(
        'div',
        { 'data-pop-up-id': this._id, id: this._id },
        _react2.default.createElement(View, (0, _extends3.default)({}, viewProps || dummy, { close: close }))
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._bridge = { getDetails: this._getDetails };
      _PopUpManager2.default.register(this._bridge);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._bridge && _PopUpManager2.default.unregister(this._bridge);
    }
  }]);
  return PopUp;
}(_react2.default.PureComponent);

exports.default = PopUp;