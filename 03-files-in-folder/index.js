const { readdir, stat } = require('fs');
const path = require('path');
try {
  readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
    if (!err) {
      files.forEach(file => {
        if (file.isFile()) {
          stat(path.join(__dirname, 'secret-folder', `${file.name}`), (err, stats) => {
            if (!err) {
              const fileNameWExt = path.resolve(__dirname, 'secret-folder', `${file.name}`);
              const fileExt = path.extname(fileNameWExt);
              const fileName = path.basename(fileNameWExt, fileExt);
              const fileSize = stats.size / 1024 + 'kb';
              console.log(`${fileName} - ${fileExt.slice(1)} - ${fileSize}`);
            } else {
              throw err;
            }
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