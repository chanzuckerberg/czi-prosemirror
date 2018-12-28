// @flow

import {EditorState} from 'prosemirror-state';
import React from 'react';
import ReactDOM from 'react-dom';

import convertFromDOMElement from '../src/convertFromDOMElement';
import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';

const EDITOR_STATE = function name(params) {
  const templateNode = document.createElement('div');
  ReactDOM.render(<DemoAppHTMLTemplate />, templateNode);
  return convertFromDOMElement(templateNode);
}();

// Reference: http://prosemirror.net/examples/basic/
export default function createDemoTemplateEditorState(): EditorState {
  return EDITOR_STATE;
}