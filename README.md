<h1 align="center">Licit Editor</h1>

<div align="center">
  <strong>WYSIWYG editor based on ProseMirror & React</strong>
</div>
<div align="center">
  Includes significant text markup including size, face, color, line spacing, strikethrough, bold, italic, etc.; multi-level bullet/number lists; images with text wrapping and resizing; and a powerful table (with images and markup within table)
</div>

![GitHub last commit](https://img.shields.io/github/last-commit/MO-Movia/licit)
![Website](https://img.shields.io/website?down_color=red&down_message=Offline&up_color=green&up_message=Online&url=http%3A%2F%2Fgreathints.com)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

--- 

+ Initially forked from [CZI Prosemirror](https://github.com/chanzuckerberg/czi-prosemirror)
  
+ Core is [Prosemirror editor](https://prosemirror.net/) created by [Marijn Haverbeke](https://marijnhaverbeke.nl/)

+  [Live DEMO Here](http://greathints.com:3001/) 

+ Don't forget to look at the [wiki](https://github.com/MO-Movia/licit/wiki)
  
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

You may find the latest commit hash at https://github.com/MO-Movia/licit/commits/master
