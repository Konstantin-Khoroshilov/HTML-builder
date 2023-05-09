const { readdir, mkdir, rm, access, copyFile } = require('fs/promises');
const path = require('path');
const sourceDir = path.resolve(__dirname, 'files');
const destinationDir = path.resolve(__dirname, 'files-copy');

const copyDir = async (sourceDir, destinationDir) => {
  try {
    await access(destinationDir);
    await rm(destinationDir, { recursive: true });
    await mkdir(destinationDir);
  } catch {
    await mkdir(destinationDir);
  }
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

copyDir(sourceDir, destinationDir);
