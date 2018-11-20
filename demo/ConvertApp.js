// @flow

import './convert-app.css';
import CustomButton from '../src/ui/CustomButton';
import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';
import Editor from '../src/ui/Editor';
import EditorToolbar from '../src/ui/EditorToolbar';
import React from 'react';
import ReactDOM from 'react-dom';
import convertDraftJSToHTML from '../src/convertDraftJSToHTML';
import convertFromDraftJS from '../src/convertFromDraftJS';
import convertFromHTML from '../src/convertFromHTML';
import createEmptyEditorState from '../src/createEmptyEditorState';
import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

const LOCAL_STORAGE_KEY = 'convert-app';
const RIGHT_ARROW_CHAR = '\u21E2';
const DRAFT_JS_EXAMPLE = `
{
  "blocks": [
    {
      "key": "74nfs",
      "text": "hello",
      "type": "header-one",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ],
  "entityMap": {}
}
`;

function getInitialState(): Object {
  let draftjs = '';
  let html = '';
  let editorState = null;

  try {
    const value = window.localStorage.getItem(LOCAL_STORAGE_KEY) || '';
    const json = JSON.parse(value);
    draftjs = json.draftjs;
    html = json.html;
    editorState = createEmptyEditorState();
    if (!draftjs || !html) {
      throw new Error('no content');
    }
  } catch (ex) {
    draftjs = DRAFT_JS_EXAMPLE.trim();
    html = convertDraftJSToHTML(draftjs);
    editorState = convertFromHTML(html);
  };
  return {
    draftjs,
    editorState,
    html,
  };
}

class ConvertAppArea extends React.Component<any, any, any> {
  render(): React.Element<any> {
    const {className, children,title} = this.props;
    const cn = cx(className, 'convert-app-area');
    return (
      <div className={cn}>
        <div className="convert-app-area-head">
          <span className="convert-app-area-title">{title}</span>
        </div>
        <div className="convert-app-area-body">
          {children}
        </div>
      </div>
    );
  }
}

class ConvertApp extends React.PureComponent<any, any, any> {
  _sid = null;
  _dropping = false;
  state = getInitialState();

  render(): React.Element<any> {
    const {draftjs, html, editorState} = this.state;
    return (
      <div className="convert-app">
        <div className="grid-container">
          <ConvertAppArea
            className="header"
            title="CZI-Promise-Mirror Content Conversion Tool">
            <div className="czi-custom-buttons">
              <CustomButton
                label={`DraftJS ${RIGHT_ARROW_CHAR} ProseMirror`}
                onClick={this._toProseMirror}
                value="draftjs"
              />
              <CustomButton
                label={`HTML ${RIGHT_ARROW_CHAR} ProseMirror`}
                onClick={this._toProseMirror}
                value="html"
              />
            </div>
            <a href="http://cdn.summitlearning.org/assets/index_docs_editor_0_0_9_4.html" target="new">
              draft-js editor {'\u2197'}
            </a>
          </ConvertAppArea>
          <ConvertAppArea
            className="draftjs"
            title="DraftJS JSON View">
            <textarea
              onChange={this._onDraftJSChange}
              spellCheck={false}
              value={draftjs}
            />
          </ConvertAppArea>
          <ConvertAppArea
            className="html"
            title="HTML View">
            <textarea
              onChange={this._onHTMLChange}
              onDrop={this._onHTMLDrop}
              spellCheck={false}
              value={html}
            />
          </ConvertAppArea>
          <ConvertAppArea
            className="prosemirror"
            title="ProseMirror View">
            <Editor
              editorState={editorState}
              onChange={this._onEditorChange}
            />
          </ConvertAppArea>
        </div>
      </div>
    );
  }

  _onEditorChange = (editorState: EditorState): void => {
    this.setState({editorState});
  };

  _onDraftJSChange = (e: SyntheticInputEvent): void => {
    const draftjs = e.target.value;
    this.setState({draftjs}, this._save);
  };

  _onHTMLChange = (e: SyntheticInputEvent) => {
    const html = e.target.value;
    this.setState({html}, this._save);
  };

  _onHTMLDrop = (e: any): void => {
    e.preventDefault();

    if (this._dropping) {
      return;
    }
    this._dropping = true;

    const el: any = e.currentTarget;
    const file = e.dataTransfer.files[0];
    if (!file || !(/\.html$/).test(file.name)) {
      return;
    }
    let reader = new FileReader();

    reader.onload = (onload) => {
      el.readOnly = false;
      const html = el.value =
        `<!--\n${String(file.name)}\n-->\n` + onload.target.result;
      this._dropping = false;
      reader = null;
      const editorState = convertFromHTML(html);

      this.setState({html, editorState}, this._save);
    };

    reader.onerror = (onerror) => {
      const html = onerror.message || 'unable to read file';
      this._dropping = false;
      reader = null;
      this.setState({html});
    };

    el.readOnly = true;
    el.value = 'Load: ' + file.name;
    setTimeout(() => {
      reader && reader.readAsText(file);
    }, 500);
  };

  _save = (): void => {
    this._sid && clearTimeout(this._sid);
    this._sid = setTimeout(this._saveToLocal, 500);
  };

  _saveToLocal = (): void => {
    try {
      this._sid = null;
      const {html, draftjs} = this.state;
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({html, draftjs}),
      );
    } catch (ex) {
      // skip
    }
  }

  _toProseMirror = (source: string): void => {
    if (source === 'draftjs') {
      // TODO: support this;
      const html = convertDraftJSToHTML(this.state.draftjs);
      const editorState = convertFromHTML(html);
      this.setState({html, editorState});
    } else if (source === 'html') {
      const editorState = convertFromHTML(this.state.html);
      this.setState({editorState});
    }
  };

  _toHTML = (source: string): void => {
    if (source === 'draftjs') {
      const html = convertDraftJSToHTML(this.state.draftjs);
      this.setState({html});
    }
  };
}

function main(): void {
  const el = document.createElement('div');
  const {body} = document;
  body && body.appendChild(el);
  ReactDOM.render(<ConvertApp />, el);
}

window.onload = main;
