// FS IRAD-983 2020-06-10
// prosemirror-tables install doesn't create dist folder correctly,
// so copy all js files from it's src to dist.
const process = require('process');
const path = require('path');
const fs = require("fs");

// get current directory 
const cwd = process.cwd();

// find prosemirror-tables dir.
var pmtDir = path.resolve(cwd, "./node_modules/prosemirror-tables");
var found = false;
 
found = fs.existsSync(pmtDir);	
if(!found) {
	// New path is @modusoperandi/licit
    pmtDir = path.resolve(cwd, "../../prosemirror-tables");
    found = fs.existsSync(pmtDir);
}

if(found){
    // copy all js files in src to dist.
    const { exec } = require("child_process");
    const source = path.resolve(pmtDir, "./src");
    const dest = path.resolve(pmtDir, "./dist");

    exec("cp -f \"" + source + "\"" + "/*.js" + " \"" + dest + "\"", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });
}  