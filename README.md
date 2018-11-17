
***Notice: This project still under active development. API documentations will be available later.***

---

# CZI-ProseMirror

+ Drop-In WYSIWYG editor based on ProseMirror & React
+ Live DEMO: http://cdn.summitlearning.org/assets/czi_prosemirror_0_0_1_b_index.html

---

## Getting Started

### Getting dependencies

```
git clone https://github.com/chanzuckerberg/czi-prosemirror.git
cd czi-prosemirror
npm install
```


### Install dependencies
```
cd czi-prosemirror
npm install
```

### Start the web server

```
# At the working directory `czi-prosemirror`
npm run start
```
Test http://localhost:3001/ from your browser

## Development with React

```

import {createEmptyEditorState, Editor, EditorToolbar} from 'czi-prosemirror';

class DemoApp extends React.PureComponent<any, any, any> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      editorState: createEmptyEditorState(),
      editorView: null,
    };
  }

  render(): React.Element<any> {
    const {editorState, editorView} = this.state;
    return (
      <div>
        <EditorToolbar
          editorState={editorState}
          editorView={editorView}
          onChange={this._onChange}
        />
        <Editor
          editorState={editorState}
          onChange={this._onChange}
          onReady={this._onReady}
        />
      </div>
    );
  }

  _onReady = (editorView)=> {
     this.setState({editorView});
  };

  _onChange = (editorState: EditorState) => {
    this.setState({editorState});
  };
}
```

