// @flow

import cx from 'classnames';
import {EditorState} from 'prosemirror-state';
import React from 'react';
import ReactDOM from 'react-dom';

import convertFromHTML from '../../src/convertFromHTML';
import convertFromJSON from '../../src/convertFromJSON';
import convertToJSON from '../../src/convertToJSON';
import createEmptyEditorState from '../../src/createEmptyEditorState';
import CustomButton from '../../src/ui/CustomButton';
import RichTextEditor from '../../src/ui/RichTextEditor';

import './convert-app.css';

const LOCAL_STORAGE_KEY = 'convert-app';
const RIGHT_ARROW_CHAR = '\u21E2';

function getInitialState(): Object {
  let html = '';
  let editorState = null;
  let prosemirrorJSON = '';

  try {
    const value = window.localStorage.getItem(LOCAL_STORAGE_KEY) || '';
    const json = JSON.parse(value);
    html = json.html;
    prosemirrorJSON = json.prosemirrorJSON || '';
    editorState = createEmptyEditorState();
    if (!html) {
      throw new Error('no content');
    }
  } catch (ex) {
    // pass
  };
  return {
    editorState,
    html,
    prosemirrorJSON,
    readOnly: false,
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
    const {html, editorState, prosemirrorJSON, readOnly} = this.state;
    return (
      <div className="convert-app">
        <div className="grid-container">
          <ConvertAppArea
            className="header"
            title="CZI-Promise-Mirror Content Conversion Tool">
            <div className="czi-custom-buttons">
              <CustomButton
                label={`HTML ${RIGHT_ARROW_CHAR} ProseMirror`}
                onClick={this._toProseMirror}
                value="html"
              />
            </div>
            <div className="czi-custom-buttons">
              <CustomButton
                label={`JSON ${RIGHT_ARROW_CHAR} ProseMirror`}
                onClick={this._toProseMirror}
                value="prosemirrorJSON"
              />
              <CustomButton
                label={`ProseMirror ${RIGHT_ARROW_CHAR} JSON`}
                onClick={this._toProseMirrorJSON}
              />
            </div>
             <div className="czi-custom-buttons">
              <CustomButton
                label={RIGHT_ARROW_CHAR + (readOnly ? ' Edit' : ' Read-only')}
                onClick={this._toggleReadOnly}
                value="html"
              />
            </div>
          </ConvertAppArea>
          <ConvertAppArea
            className="prosemirror-json"
            title="ProseMirror JSON View">
            <textarea
              onChange={this._onProseMirrorJSONChange}
              spellCheck={false}
              value={prosemirrorJSON}
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
            <RichTextEditor
              disabled={false}
              editorState={editorState}
              embedded={false}
              height="100%"
              onChange={this._onEditorChange}
              placeholder="Type something here..."
              readOnly={readOnly}
              width="100%"
            />
          </ConvertAppArea>
        </div>
      </div>
    );
  }

  _onEditorChange = (editorState: EditorState): void => {
    this.setState({editorState});
  };

  _onProseMirrorJSONChange = (e: SyntheticInputEvent): void => {
    const prosemirrorJSON = e.target.value;
    this.setState({prosemirrorJSON}, this._save);
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
      const {html, prosemirrorJSON} = this.state;
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({html,prosemirrorJSON}),
      );
    } catch (ex) {
      // skip
    }
  }

  _toProseMirrorJSON = ():void => {
    const {editorState} = this.state;
    const prosemirrorJSON = JSON.stringify(convertToJSON(editorState), null, 2);
    this.setState({prosemirrorJSON}, this._save);
  };

  _toProseMirror = (source: string): void => {
    if (source === 'html') {
      const editorState = convertFromHTML(this.state.html);
      this.setState({editorState});
    } else if (source === 'prosemirrorJSON') {
      const editorState = convertFromJSON(this.state.prosemirrorJSON);
      this.setState({editorState});
    }
  };

  _toggleReadOnly = (): void => {
    this.setState({readOnly: !this.state.readOnly});
  };
}

function main(): void {
  const el = document.createElement('div');
  const {body} = document;
  body && body.appendChild(el);
  ReactDOM.render(<ConvertApp />, el);
}

window.onload = main;
