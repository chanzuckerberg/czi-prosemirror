// @flow

import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import * as React from 'react';
import ReactDOM from 'react-dom';

import CommandButton from './CommandButton';
import CommandMenuButton from './CommandMenuButton';
import CustomButton from './CustomButton';
import {COMMAND_GROUPS, parseLabel} from './EditorToolbarConfig';
import Icon from './Icon';
import ResizeObserver from './ResizeObserver';
import UICommand from './UICommand';
import isReactClass from './isReactClass';

import './czi-editor-toolbar.css';

class EditorToolbar extends React.PureComponent<any, any> {
  _body = null;

  props: {
    disabled?: ?boolean,
    dispatchTransaction?: ?(tr: Transform) => void,
    editorState: EditorState,
    editorView: ?EditorView,
    onReady?: ?(view: EditorView) => void,
    readOnly?: ?boolean,
  };

  state = {
    expanded: false,
    wrapped: null,
  };

  render(): React.Element<any> {
    const {wrapped, expanded} = this.state;
    const className = cx('czi-editor-toolbar', {expanded, wrapped});
    const wrappedButton = wrapped ? (
      <CustomButton
        active={expanded}
        className="czi-editor-toolbar-expand-button"
        icon={Icon.get('more_horiz')}
        key="expand"
        onClick={this._toggleExpansion}
        title="More"
        value={expanded}
      />
    ) : null;
    return (
      <div className={className}>
        <div className="czi-editor-toolbar-flex">
          <div className="czi-editor-toolbar-body">
            <div
              className="czi-editor-toolbar-body-content"
              ref={this._onBodyRef}
            >
              <i className="czi-editor-toolbar-wrapped-anchor" />
              {COMMAND_GROUPS.map(this._renderButtonsGroup)}
              <div className="czi-editor-toolbar-background">
                <div className="czi-editor-toolbar-background-line" />
                <div className="czi-editor-toolbar-background-line" />
                <div className="czi-editor-toolbar-background-line" />
                <div className="czi-editor-toolbar-background-line" />
                <div className="czi-editor-toolbar-background-line" />
              </div>
              <i className="czi-editor-toolbar-wrapped-anchor" />
            </div>
            {wrappedButton}
          </div>
          <div className="czi-editor-toolbar-footer" />
        </div>
      </div>
    );
  }

  _renderButtonsGroup = (group: Object, index: number): React.Element<any> => {
    const buttons = Object.keys(group)
      .map(label => {
        const obj = group[label];

        if (isReactClass(obj)) {
          // JSX requies the component to be named with upper camel case.
          const ThatComponent = obj;
          const {editorState, editorView, dispatchTransaction} = this.props;
          return (
            <ThatComponent
              dispatch={dispatchTransaction}
              editorState={editorState}
              editorView={editorView}
              key={label}
            />
          );
        } else if (obj instanceof UICommand) {
          return this._renderButton(label, obj);
        } else if (Array.isArray(obj)) {
          return this._renderMenuButton(label, obj);
        } else {
          return null;
        }
      })
      .filter(Boolean);
    return (
      <div className="czi-custom-buttons" key={'g' + String(index)}>
        {buttons}
      </div>
    );
  };

  _renderMenuButton = (
    label: string,
    commandGroups: Array<{[string]: UICommand}>
  ): React.Element<any> => {
    const {editorState, editorView, disabled, dispatchTransaction} = this.props;
    const {icon, title} = parseLabel(label);
    return (
      <CommandMenuButton
        commandGroups={commandGroups}
        disabled={disabled}
        dispatch={dispatchTransaction}
        editorState={editorState}
        editorView={editorView}
        icon={icon}
        key={label}
        label={icon ? null : title}
        title={title}
      />
    );
  };

  _renderButton = (label: string, command: UICommand): React.Element<any> => {
    const {disabled, editorState, editorView, dispatchTransaction} = this.props;
    const {icon, title} = parseLabel(label);

    return (
      <CommandButton
        command={command}
        disabled={disabled}
        dispatch={dispatchTransaction}
        editorState={editorState}
        editorView={editorView}
        icon={icon}
        key={label}
        label={icon ? null : title}
        title={title}
      />
    );
  };

  _onBodyRef = (ref: any): void => {
    if (ref) {
      this._body = ref;
      // Mounting
      const el = ReactDOM.findDOMNode(ref);
      if (el instanceof HTMLElement) {
        ResizeObserver.observe(el, this._checkIfContentIsWrapped);
      }
    } else {
      // Unmounting.
      const el = this._body && ReactDOM.findDOMNode(this._body);
      if (el instanceof HTMLElement) {
        ResizeObserver.unobserve(el);
      }
      this._body = null;
    }
  };

  _checkIfContentIsWrapped = (): void => {
    const ref = this._body;
    const el: any = ref && ReactDOM.findDOMNode(ref);
    const startAnchor = el && el.firstChild;
    const endAnchor = el && el.lastChild;
    if (startAnchor && endAnchor) {
      const wrapped = startAnchor.offsetTop < endAnchor.offsetTop;
      this.setState({wrapped});
    }
  };

  _toggleExpansion = (expanded: boolean): void => {
    this.setState({expanded: !expanded});
  };
}

export default EditorToolbar;
