# docs-editor
Rich Text Editor for education purpose.

## DEMO
http://cdn.summitlearning.org/assets/index_latest.html

## Getting start

1. Clone the repository to your local machine. `git clone git@github.com:chanzuckerberg/education-doc-editor.git`
2. Check if your Node.js version is >= 6.
3. Start with the project folder `cd react-math-input-app`
4. Run `npm install` (just for the first time build)

## For development

1. Start with the project folder `cd education-doc-editor`
2. Run `killall -9 node; npm run start` to start the local dev server
3. Load http://127.0.0.1:3001/index.html

## For deployment to production

1. Push changes to master
2. Start with the project folder `cd education-doc-editor`
3. Build master from dev server `killall -9 node; NODE_ENV=production npm run build`
4. Build deploy command `python generate_deploy_script.py`
5. Execute the command `sh deploy_to_s3.sh`
6. Verify that the files are available on s3.

## For Your own (React) application

```
import {DocsEditor, convertFromRaw, convertToRaw}  from 'docs-editor';

class DemoApp extends React.PureComponent<any, any, any> {

  state = convertFromRaw();

  render(): React.Element<any> {
    return (
      <DocsEditor
        editorState={this.state.editorState}
        onChange={this._onChange}
      />
    );
  }

  _onChange = (editorState: Object): void => {
    this.setState({editorState});
    console.log(convertToRaw(editorState));
  };
}
```
