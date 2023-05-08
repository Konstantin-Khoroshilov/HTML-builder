const { readdir, mkdir, rm, access, copyFile } = require('fs/promises');
const path = require('path');
const sourceDir = path.resolve(__dirname, 'files');
const destinationDir = path.resolve(__dirname, 'files-copy');

const copyDir = async (sourceDir, destinationDir) => {
  const files = await readdir(sourceDir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await mkdir(path.resolve(destinationDir, file.name));
      await copyDir(path.resolve(sourceDir, file.name), path.resolve(destinationDir, file.name));
    }
    if (file.isFile()) {
      await copyFile(path.resolve(sourceDir, file.name), path.resolve(destinationDir, file.name));
    }
  }
};

const createDir = async (destination) => {
  try {
    await access(destination);
    await rm(destination, { recursive: true });
    await mkdir(destination);
  } catch {
    await mkdir(destination);
  }
};

createDir(destinationDir);
copyDir(sourceDir, destinationDir);
