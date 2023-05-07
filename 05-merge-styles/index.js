const { readdir, unlink, access, writeFile, readFile, appendFile } = require('fs');
const path = require('path');
const sourceDir = path.resolve(__dirname, 'styles');
const destinationDir = path.resolve(__dirname, 'project-dist', 'bundle.css');

access(destinationDir, err => {
  if (!err) {
    unlink(destinationDir, (err) => {
      if (err) throw err;
      writeFile(
        destinationDir,
        '',
        err => {
          if (err) throw err;
        }
      );
    });
  } else {
    writeFile(
      destinationDir,
      '',
      err => {
        if (err) throw err;
      }
    );
  }
});

try {
  readdir(sourceDir, { withFileTypes: true }, (err, files) => {
    if (!err) {
      files.forEach(file => {
        if (file.isFile()) {
          const fileNameWExt = path.resolve(sourceDir, `${file.name}`);
          const fileExt = path.extname(fileNameWExt);
          if (fileExt === '.css') {
            readFile(path.resolve(sourceDir, file.name), 'utf-8', (err, data) => {
              if (err) throw err;
              appendFile(destinationDir, data.toString(), err => {
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
} catch (err) {
  console.log(err);
}


