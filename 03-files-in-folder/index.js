const { readdir, stat } = require('fs/promises');
const path = require('path');
const folderPath = path.resolve(__dirname, 'secret-folder');

const logFilesInfo = async (folderPath) => {
  const files = await readdir(folderPath, { withFileTypes: true });
  for (const file of files) {
    const stats = await stat(path.resolve(folderPath, file.name));
    if (file.isFile()) {
      const splittedFileName = file.name.split('.');
      const fileExt = splittedFileName.pop();
      const fileName = splittedFileName.join('.');
      const fileSize = stats.size / 1024 + 'kb';
      console.log(`${fileName} - ${fileExt} - ${fileSize}`);
    }
  }
};

logFilesInfo(folderPath);
