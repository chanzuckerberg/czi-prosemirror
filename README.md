





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
    <a href="http://greathints.com:3001/">Demo
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
cd licit
npm install
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
py run_collab_server.py  

In MacOS/Linux
python run_collab_server.py
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
 User can enable the same using the below configuration:
 ```
 ReactDOM.render(React.createElement(Licit, {collaborative: true, docID: 1, debug: true}), document.getElementById('root'));
```
|Property Name| Description|Default Value| 
|--|--|--|
|collaborative  | Enable/disable the collaborative functionality of this editor. |false
|docID  |Id of the collaborative document. Used only when the collaboration is enabled. |1
| debug |Show/hide prosemirror dev tools|false


To load the styles:
Either in *angular.json*, add
 *"styles": [
 "node_modules/licit/dist/styles.css",
]*
OR 
in the default global CSS file *src\styles.scss*, add
*@import  "~licit/dist/styles.css"*

Run *npm start* to see the licit editor inside the angular application.

## Use it for your own project  

For using licit in your project you should follow these steps:  

For example (in an Angular app):
 
```
# At the working directory `licit`

npm run build:demo
```  

Now you will find a new directory (*bin*) with *demo.bundle.js* file. 

Add this *bin* folder to your own project and also include the *demo.bundle.js* file in the scripts array of *angular.json* file as follows: 

"scripts": [
"src/bin/demo.bundle.js"
] 

To start the collaboration server, follow the steps below:

Run the Collaborative server in licit/servers directory using following command:

```
node run_demo_collab_server.bundle.js PORT='<yourPort>' IP='<yourIP/Hostname>'
```

NOTE: In case if you are hosting collab server in a different location or machine then you need to change the host name and port number in *licit\demo\client\DemoCollabConnector.js* accordingly. 
```
const url = <yourLocationProtocol> + '\/\/' +
<yourIP/Hostname>+ ':<yourPort>/docs/' +
docID;  
```
Run *ng serve* to see the collaborative licit editor inside the angular application.



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
