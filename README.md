
***Notice: This project still under active development. API documentations will be available later.***

---

# CZI-ProseMirror &middot; [![Build Status](https://travis-ci.com/chanzuckerberg/czi-prosemirror.svg?branch=master)](https://travis-ci.com/chanzuckerberg/czi-prosemirror)

+ Drop-In WYSIWYG editor based on ProseMirror & React
+ Live DEMO: http://cdn.summitlearning.org/assets/czi_prosemirror_0_0_1_1_20190412230633_index.html

---

## Getting Started

### Getting repository

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
npm start
```
Test http://localhost:3001/ from your browser

### Build the distribution files

```
# At the working directory `czi-prosemirror`
npm run build:dist
```

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

## Use it for your own project


This project still under active development. There will be NPM package published later.
For now, you can install using the commit hash to include the package to your own `package.json`.

For example:

```
npm install --save "chanzuckerberg/czi-prosemirror#8313aa0970b607c17019f7a5cc8df58c46e78916"
```

You may find the latest commit hash at https://github.com/chanzuckerberg/czi-prosemirror/commits/master



