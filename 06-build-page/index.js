const { readdir, copyFile, access, writeFile, readFile, appendFile, mkdir, rm } = require('fs');
const path = require('path');
const cssSourceDir = path.resolve(__dirname, 'styles');
const assetsSourceDir = path.resolve(__dirname, 'assets');
const destinationDir = path.resolve(__dirname, 'project-dist');
const htmlDestinationDir = path.resolve(destinationDir, 'index.html');
const cssDestinationDir = path.resolve(destinationDir, 'style.css');
const assetsDestinationDir = path.resolve(destinationDir, 'assets');
const copyDir = (sourceDir, destinationDir) => {
  try {
    readdir(sourceDir, { withFileTypes: true }, (err, files) => {
      if (!err) {
        files.forEach(file => {
          if (file.isDirectory()) {
            mkdir(path.resolve(destinationDir, file.name), (err) => { if (err) { throw err; } });
            copyDir(path.resolve(sourceDir, file.name), path.resolve(destinationDir, file.name));
          }
          if (file.isFile()) {
            copyFile(path.resolve(sourceDir, file.name), path.resolve(destinationDir, file.name), err => {
              if (err) throw err;
            });
          }
        });
      } else {
        throw err;
      }
    });
  } catch (err) {
    console.log(err);
  }
};
const build = () => {
  readFile(path.resolve(__dirname, 'template.html'), 'utf-8', (err, data) => {
    if (err) throw err;
    let template = data.toString();
    readdir(path.resolve(__dirname, 'components'), { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        readFile(path.resolve(__dirname, 'components', file.name), 'utf-8', (err, data) => {
          if (err) throw err;
          template = template.replace(`{{${file.name.split('.')[0]}}}`, data.toString());
          writeFile(htmlDestinationDir, template, (err) => { if (err) { throw err; } });
        });
      });
    });
  });
  readdir(cssSourceDir, { withFileTypes: true }, (err, files) => {
    if (!err) {
      writeFile(cssDestinationDir, '', err => {
        if (err) throw err;
      });
      files.forEach(file => {
        if (file.isFile()) {
          const fileNameWExt = path.resolve(cssSourceDir, `${file.name}`);
          const fileExt = path.extname(fileNameWExt);
          if (fileExt === '.css') {
            readFile(path.resolve(cssSourceDir, file.name), 'utf-8', (err, data) => {
              if (err) throw err;
              appendFile(cssDestinationDir, data.toString() + '\n', err => {
                if (err) throw err;
              });
            });
          }
        }
      });
    } else {
      throw err;
    }
  });
  access(assetsDestinationDir, err => {
    if (!err) {
      rm(assetsDestinationDir,
        { recursive: true },
        err => {
          if (err) { throw err; }
          mkdir(assetsDestinationDir, (err) => { if (err) { throw err; } });
          copyDir(assetsSourceDir, assetsDestinationDir);
        }
      );
    } else {
      mkdir(assetsDestinationDir, (err) => { if (err) { throw err; } });
      copyDir(assetsSourceDir, assetsDestinationDir);
    }
  });
};
access(destinationDir, err => {
  if (!err) {
    rm(destinationDir,
      { recursive: true },
      err => {
        if (err) { throw err; }
        mkdir(destinationDir, (err) => { if (err) { throw err; } });
        build();
      }
    );
  } else {
    mkdir(destinationDir, (err) => { if (err) { throw err; } });
    build();
  }
});
