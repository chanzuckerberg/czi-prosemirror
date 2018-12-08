'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = createPopUp;

require('./czi-pop-up.css');

var _PopUp = require('./PopUp');

var _PopUp2 = _interopRequireDefault(_PopUp);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ViewProps = require('./PopUp').babelPluginFlowReactPropTypes_proptype_ViewProps || require('prop-types').any;

// eslint-disable-next-line no-unused-vars


var babelPluginFlowReactPropTypes_proptype_PopUpParams = require('./PopUp').babelPluginFlowReactPropTypes_proptype_PopUpParams || require('prop-types').any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_PopUpHandle', {
  value: require('prop-types').shape({
    close: require('prop-types').func.isRequired,
    update: require('prop-types').func.isRequired
  })
});


var modalsCount = 0;
var popUpsCount = 0;

var Z_INDEX_BASE = 9999;
var MODAL_MASK_ID = 'pop-up-modal-mask-' + (0, _uuid2.default)();

function showModalMask() {
  var root = document.body || document.documentElement;
  var element = document.getElementById(MODAL_MASK_ID);
  if (!element) {
    element = document.createElement('div');
    element.id = MODAL_MASK_ID;
    element.className = 'czi-pop-up-modal-mask';
    element.setAttribute('data-mask-type', 'czi-pop-up-modal-mask');
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
  }

  if (root && !element.parentElement) {
    root.appendChild(element);
  }
  var style = element.style;

  var selector = '.czi-pop-up-element[data-pop-up-modal]';
  var zIndex = (0, _from2.default)(document.querySelectorAll(selector)).reduce(function (zz, el) {
    return Math.max(zz, Number(el.style.zIndex));
  }, 0);

  style.zIndex = zIndex - 1;
}

function hideModalMask() {
  var element = document.getElementById(MODAL_MASK_ID);
  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
}

function getRootElement(id, forceCreation, popUpParams) {
  var root = document.body || document.documentElement;
  var element = document.getElementById(id);
  if (!element && forceCreation) {
    element = document.createElement('div');
  }

  if (!element) {
    return null;
  }

  if (popUpParams && popUpParams.modal) {
    element.setAttribute('data-pop-up-modal', 'y');
  }

  element.className = 'czi-pop-up-element';
  element.id = id;

  var style = element.style;
  style.zIndex = Z_INDEX_BASE + popUpsCount * 3;

  // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  if (root && !element.parentElement) {
    root.appendChild(element);
  }
  return element;
}

function renderPopUp(rootId, close, View, viewProps, popUpParams) {
  var rootNode = getRootElement(rootId, true, popUpParams);
  if (rootNode) {
    var component = _react2.default.createElement(_PopUp2.default, {
      View: View,
      close: close,
      popUpParams: popUpParams,
      viewProps: viewProps
    });
    _reactDom2.default.render(component, rootNode);
  }

  if (modalsCount > 0) {
    showModalMask();
  } else {
    hideModalMask();
  }
}

function unrenderPopUp(rootId) {
  var rootNode = getRootElement(rootId, false);
  if (rootNode) {
    _reactDom2.default.unmountComponentAtNode(rootNode);
    rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  }

  if (modalsCount === 0) {
    hideModalMask();
  };
}

function createPopUp(View, viewProps, popUpParams) {
  var rootId = (0, _uuid2.default)();

  var handle = null;
  var currentViewProps = viewProps;

  viewProps = viewProps || {};
  popUpParams = popUpParams || {};

  var modal = popUpParams.modal || !popUpParams.anchor;
  popUpParams.modal = modal;

  popUpsCount++;
  if (modal) {
    modalsCount++;
  }

  var closePopUp = function closePopUp(value) {
    if (!handle) {
      return;
    }

    if (modal) {
      modalsCount--;
    }
    popUpsCount--;

    handle = null;
    unrenderPopUp(rootId);

    var onClose = popUpParams && popUpParams.onClose;
    onClose && onClose(value);
  };

  var render = renderPopUp.bind(null, rootId, closePopUp, View);
  var emptyObj = {};

  handle = {
    close: closePopUp,
    update: function update(nextViewProps) {
      currentViewProps = nextViewProps;
      render(currentViewProps || emptyObj, popUpParams || emptyObj);
    }
  };

  render(currentViewProps || emptyObj, popUpParams || emptyObj);
  return handle;
}