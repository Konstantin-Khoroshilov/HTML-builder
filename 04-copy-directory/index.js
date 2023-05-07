const { readdir, mkdir, rm, access, copyFile } = require('fs');
const path = require('path');
const sourceDir = path.resolve(__dirname, 'files');
const destinationDir = path.resolve(__dirname, 'files-copy');
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
access(destinationDir, err => {
  if (!err) {
    rm(destinationDir,
      { recursive: true },
      err => {
        if (err) { throw err; }
        mkdir(destinationDir, (err) => { if (err) { throw err; } });
        copyDir(sourceDir, destinationDir);
      }
    );
  } else {
    mkdir(destinationDir, (err) => { if (err) { throw err; } });
    copyDir(sourceDir, destinationDir);
  }
});