











<h1 align="center">Licit Editor</h1>

<div align="center">
  <strong>WYSIWYG editor based on ProseMirror & React</strong>
</div>
<div align="center">
  Includes significant text markup including size, face, color, line spacing, strikethrough, bold, italic, etc.; multi-level bullet/number lists; images with text wrapping and resizing; and a powerful table (with images and markup within table)
</div>
&nbsp;
<div align="center">
  
![GitHub last commit](https://img.shields.io/github/last-commit/MO-Movia/licit)
![Website](https://img.shields.io/website?down_color=red&down_message=Offline&up_color=green&up_message=Online&url=http://www.greathints.com)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

</div>
<div align="center">
  <h3>
    <a href="https://github.com/MO-Movia/licit/wiki">Wiki
    </a>
    <span> | </span>
    <a href="http://greathints.com/licit">Demo
    </a>
    <span> | </span>
    <a href="https://prosemirror.net/">Based on...
    </a>
  </h3>
</div>

## Getting Started  

### Getting repository

```
git clone https://github.com/MO-Movia/licit.git 
```
### Install Prerequisite
```
Make(0.8.1)
Python(3.8.2) 
``` 

### Install dependencies
```
cd licit 
npm install
``` 

In order to upload image work correctly, "images" folder is expected outside the root folder 'licit'.
  

### Start the collaboration server
```
In Windows
To build collab server:
py build_collab_server.py

To run collab server:
py run_collab_server.py 

In MacOS/Linux
To build collab server:
python build_collab_server.py

To run collab server:
python run_collab_server.py 
```  

### Start the image server for Upload image 
```
In Windows
py run_image_server.py  

In MacOS/Linux
python run_image_server.py
```  

### Start the web server

```
In Windows
py run_web_server.py  

In MacOS/Linux
python run_web_server.py
```
Test http://localhost:3001/ from your browser.  

### Build the distribution files 
```
# At the working directory `licit` 
npm run build:dist
``` 
## Use Licit as a component

For using licit in your project you should follow these steps:  
 
 To build the licit pack, run the below commands:
```
# At the working directory `licit`
npm pack
```  

Now you will find a *licit-0.0.1.tgz* file in the licit directory. 

Add this *.tgz* file to your own angular project and install it using the below command:
```
# At your angular working directory
npm install ./licit-0.0.1.tgz 
```  

**After this you can import licit component in your application like:**
```
import { Licit } from 'licit';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// To create multiple instances:
ReactDOM.render(<Licit docID={1}/>, document.getElementById('root'));
ReactDOM.render(<Licit docID={1}/>, document.getElementById('root2'));
ReactDOM.render(<Licit docID={2}/>, document.getElementById('root3'));
ReactDOM.render(<Licit docID={3}/>, document.getElementById('root4'));

// OR
ReactDOM.render(React.createElement(Licit, {docID:1}), document.getElementById("root"));
ReactDOM.render(React.createElement(Licit, {docID:2}), document.getElementById("root2"));

 ```  
 By default, the *collaboration* and the *prosemirror dev tool* are disabled for the editor.
 set  *docID* to *"0"* for disable the collaboration.
 User can enable the same using the below configuration:
 ```
 ReactDOM.render(React.createElement(Licit, {docID: 1, debug: true}), document.getElementById('root'));
```

Please refer *licit\client\index.js* for getting more detailed idea on passing properties and fires events.

|Property Name| Description|Default Value| 
|--|--|--|
|docID  |Id of the collaborative document. *docID "0"* means collaboration disabled. Based on the value of *docID* decides the collaboration communication |0
| debug|Show/hide prosemirror dev tools|false
| width|Width of the editor|100%
| height|Height of the editor|100%
| readOnly |To enable/disable editing mode|false
| data |Document data to be loaded into the editor|null
| disabled|To disable the editor|false
| embedded|To disable/enable inline behavior of the editor|false
| runtime|To pass runtime to the editor. No value means default EditorRuntime | Expects a post method '*saveimage?fn=*' in the server with input parameters *File name and File object*, and this post method parse the form data and return response in JSON format (*{id: string, height: < height of the image>, src: <relative/full_path_of_the_image>, width: < width_of_the_image>}*). Please refer *licit\utils\build_web_server.js* for '*saveimage*' method sample.

|Event Name| Description|Parameter| 
|--|--|--|
|onChange | Fires after each significant change |data
|onReady| Fires once when the editor is ready |licit reference
 

To load the styles:
Either in *angular.json*, add
 *"styles": [
 "node_modules/licit/dist/styles.css",
]*
OR 
in the default global CSS file *src\styles.scss*, add
*@import  "~licit/dist/styles.css"*

Run *npm start* to see the licit editor inside the angular application.

Note: there is a nice Angular test app designed to test the component interface of licit here: https://github.com/melgish/licit-playground - which also allows you to load and save the JSON file.

## Use it for your own project  

For using licit in your project you should follow these steps:  

For example (in an Angular app):
 
```
# At the working directory `licit`
npm run build:licit
```  

Now you will find a new directory (*bin*) with *licit.bundle.js* file. 

Add this *bin* folder to your own project and also include the *licit.bundle.js* file in the scripts array of *angular.json* file as follows: 

"scripts": [
"src/bin/licit.bundle.js"
] 

To start the collaboration server, follow the steps below:

Run the Collaborative server in licit/servers directory using following command:

```
node run_licit_collab_server.bundle.js PORT='<yourPort>' IP='<yourIP/Hostname>'
```

NOTE: In case if you are hosting collab server in a different location or machine then you need to change the host name and port number in *licit\src\client\CollabConnector.js* accordingly. 
```
const url = <yourLocationProtocol> + '\/\/' +
<yourIP/Hostname>+ ':<yourPort>/docs/' +
docID;  
```
Run *ng serve* to see the collaborative licit editor inside the angular application.

**To deploy LICIT in a server:**
```
# At the working directory `licit`
npm install 
npm run build:licit
```
Now you will find a *bin* directory, copy the files from bin to the server to run the *Licit* as a standalone application.

**You can install licit using the commit hash to include in your own `package.json`.**
 

For install the latest commit on master branch:
```
npm install --save "MO-Movia/licit"
```
For install a specific commit:
```
npm install --save "MO-Movia/licit#3de185eaccdfd745bc567d5358cf3281472d8df8"
```
You may find the latest commit hash at https://github.com/MO-Movia/licit/commits/master

## Windows Specific

Use Git bash or Windows Power Shell to install build and run the project
