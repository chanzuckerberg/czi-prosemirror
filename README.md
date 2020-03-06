
***Notice: This project is under active development. ***

---

+ WYSIWYG editor based on ProseMirror & React
+ Initially forked from [CZI Prosemirror](https://github.com/chanzuckerberg/czi-prosemirror)
+ Core is [Prosemirror editor](https://prosemirror.net/) created by [Marijn Haverbeke](https://marijnhaverbeke.nl/).
+ Live [DEMO: ](http://www.greathints.com:3001/)

---

## Getting Started

### Getting repository

```
git clone https://github.com/MO-Movia/licit.git
cd licit
npm install
```


### Install dependencies
```
cd licit
npm install
```

### Start the collaboration server
```
python run_collab_server.py
```

### Start the web server

```
# At the working directory `licit`
npm start
```
Test http://localhost:3001/ from your browser

### Build the distribution files

```
# At the working directory `licit`
npm run build:dist
```

## Development with React

```
import React from 'react';
import {createEmptyEditorState, EditorState, RichTextEditor} from 'licit';

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
TBD
```

You may find the latest commit hash at https://github.com/MO-Movia/licit/commits/master

In order to upload image work correctly, "images" folder is expected outside the root folder 'licit'.

