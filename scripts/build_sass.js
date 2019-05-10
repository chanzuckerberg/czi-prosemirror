/*eslint-env node*/

const fs = require('fs');
const glob = require('glob');
const md5 = require('md5');
const sass = require('node-sass');

function buildCSS(inputPath) {
  console.log('Converting\n  ' + inputPath);
  const outputPath = inputPath.replace(/\.scss$/, '.css');
  sass.render(
    {
      file: inputPath,
      outputStyle: 'expanded',
    },
    function(error, result) {
      // node-style callback from v3.0.0 onwards
      if (error) {
        console.log(error.status); // used to be "code" in v2x and below
        console.log(error.column);
        console.log(error.message);
        console.log(error.line);
      } else if (result.css) {
        const css = result.css.toString();
        const text = [
          '/* stylelint-disable */',
          '/* prettier-ignore */',
          '/**',
          ' * ================================================================',
          ' * DO NOT UPDATE THIS FILE MANUALLY.',
          ' * This file was programmatically generated from',
          ' *   ' + inputPath,
          ' * to update this file, run `npm run build:sass`',
          ' * @generated ' + md5(css),
          ' * ================================================================',
          ' */\n',
          css,
        ].join('\n');

        fs.writeFile(outputPath, text, function(err) {
          if (err) {
            console.log('Failed to save CSS file to\n  ' + outputPath);
          } else {
            console.log('Saved CSS file to \n  ' + outputPath);
            console.log('Done');
          }
        });
      } else {
        console.log('Error: result.css is not empty. "' + outputPath + '"');
      }
    }
  );
}

glob('./src/ui/*.scss', function(err, files) {
  if (err) {
    console.log(err);
  } else {
    files.forEach(buildCSS);
  }
});
