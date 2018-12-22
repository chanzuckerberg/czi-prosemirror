
***Notice: This project still under active development. API documentations will be available later.***

---

# CZI-ProseMirror

+ Drop-In WYSIWYG editor based on ProseMirror & React
+ Live DEMO: http://cdn.summitlearning.org/assets/czi_prosemirror_0_0_1_1_20181222013548_index.html

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
import React from 'react';
import {createEmptyEditorState, EditorState, RichTextEditor} from 'czi-prosemirror';

class Example extends React.PureComponent {

  constructor(props) {
    super(props, context);
    this.state = {
      editorState: createEmptyEditorState(),
    };
  }

  render() {
    const {editorState, editorView} = this.state;
    return (
      <RichTextEditor
        editorState={editorState}
        onChange={this._onChange}
      />
    );
  }

  _onChange = (editorState: EditorState): void => {
    this.setState({editorState});
  };
}

export default Example;
```
