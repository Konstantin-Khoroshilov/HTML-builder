const { readdir, stat } = require('fs/promises');
const path = require('path');
const folderPath = path.resolve(__dirname, 'secret-folder');

const logFilesInfo = async (folderPath) => {
  const files = await readdir(folderPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const stats = await stat(path.resolve(folderPath, file.name));
      const fileInfo = path.parse(file.name);
      const fileSize = stats.size / 1024 + 'kb';
      console.log(`${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${fileSize}`);
    }
  }
};

logFilesInfo(folderPath);
