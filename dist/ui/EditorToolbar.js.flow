// @flow

import './czi-editor-toolbar.css';
import * as EditorCommands from '../EditorCommands';
import CommandButton from './CommandButton';
import CommandMenuButton from './CommandMenuButton';
import FontSizeCommandMenuButton from './FontSizeCommandMenuButton';
import FontTypeCommandMenuButton from './FontTypeCommandMenuButton';
import Icon from './Icon';
import React from 'react';
import ReactDOM from 'react-dom';
import ResizeObserver from './ResizeObserver';
import UICommand from './UICommand';
import createEmptyEditorState from '../createEmptyEditorState';
import cx from 'classnames';
import findActiveMark from '../findActiveMark';
import isReactClass from './isReactClass';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {ICON_LABEL_PATTERN, COMMAND_GROUPS} from './EditorToolbarConfig';
import {Transform} from 'prosemirror-transform';

import type {ResizeObserverEntry} from './ResizeObserver';

const EDITOR_EMPTY_STATE = createEmptyEditorState();

class EditorToolbar extends React.PureComponent<any, any, any> {

  _ref = null;

  props: {
    disabled?: ?boolean,
    editorState: EditorState,
    editorView: ?EditorView,
    onChange?: ?(state: EditorState) => void,
    onReady?: ?(view: EditorView) => void,
    readOnly?: ?boolean,
  };

  state = {
    wrapped: false,
  };

  render(): React.Element<any> {
    const {wrapped} = this.state;
    const className = cx('czi-editor-toolbar', {wrapped});
    return (
      <div className={className} ref={this._onRef}>
        <div className="czi-editor-toolbar-body">
          {COMMAND_GROUPS.map(this._renderButtonsGroup)}
        </div>
      </div>
    );
  }

  _renderButtonsGroup = (group: Object, index: number): React.Element<any> => {
    const buttons = Object.keys(group).map(label => {
      const obj = group[label];

      if (isReactClass(obj)) {
        // JSX requies the component to be named with upper camel case.
        const ThatComponent = obj;
        const {editorState, editorView} = this.props;
        return (
          <ThatComponent
            dispatch={this._dispatchTransaction}
            editorState={editorState}
            editorView={editorView}
            key={label}
          />
        );
      } else if (obj instanceof UICommand) {
        return this._renderButton(label, obj);
      } else if (Array.isArray(obj)) {
        return this._renderMenuButton(label, obj );
      } else {
        return null;
      }
    }).filter(Boolean);
    return (
      <div key={'g' + String(index)} className="czi-custom-buttons">
        {buttons}
      </div>
    );
  };

  _renderMenuButton = (
    label: string,
    commandGroups: Array<{[string]: UICommand}>,
  ): React.Element<any> => {
    const {editorState, editorView, disabled} = this.props;
    let icon = ICON_LABEL_PATTERN.test(label) ?
      <Icon type={label} /> :
      null;
    return (
      <CommandMenuButton
        commandGroups={commandGroups}
        disabled={disabled}
        dispatch={this._dispatchTransaction}
        editorState={editorState || EDITOR_EMPTY_STATE}
        editorView={editorView}
        icon={icon}
        key={label}
        label={icon ? null : label}
      />
    );
  };

  _renderButton = (label: string, command: UICommand): React.Element<any> => {
    const {disabled, editorState, editorView} = this.props;
    let icon;
    if (ICON_LABEL_PATTERN.test(label)) {
      icon = <Icon type={label} />;
    }
    return (
      <CommandButton
        command={command}
        disabled={disabled}
        dispatch={this._dispatchTransaction}
        editorState={editorState || EDITOR_EMPTY_STATE}
        editorView={editorView}
        icon={icon}
        key={label}
        label={icon ? null : label}
      />
    );
  };

  _dispatchTransaction = (transaction: Transform): void => {
    const {onChange, editorState} = this.props;
    const nextState = (editorState || EDITOR_EMPTY_STATE).apply(transaction);
    onChange && onChange(nextState);
  };

  _onRef = (ref: any): void => {
    this._ref = ref;

    if (ref) {
      // Mounting
      const el = ReactDOM.findDOMNode(ref);
      if (el instanceof HTMLElement) {
        ResizeObserver.observe(el, this._onContentResize);
      }
    } else {
      // Unmounting.
      const el = ReactDOM.findDOMNode(this._ref);
      if (el instanceof HTMLElement) {
        ResizeObserver.unobserve(el);
      }
    }
    this._ref = ref;
  };

  _onContentResize = (info: ResizeObserverEntry): void => {
    const ref = this._ref;
    const el: any = ref && ReactDOM.findDOMNode(ref);
    const body: any = el && el.firstChild;
    if (el && body) {
      this.setState({
        wrapped: body.offsetHeight >= el.offsetHeight * 1.5,
      });
    }
  };
}

export default EditorToolbar;
