// @flow

import {EditorState} from 'prosemirror-state';
import React from 'react';
import ReactDOM from 'react-dom';

import convertFromDOMElement from '../src/convertFromDOMElement';
import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';

// Reference: http://prosemirror.net/examples/basic/
export default function createDemoTemplateEditorState(): EditorState {
  const templateNode = document.createElement('div');
  ReactDOM.render(<DemoAppHTMLTemplate />, templateNode);
  return convertFromDOMElement(templateNode);
}