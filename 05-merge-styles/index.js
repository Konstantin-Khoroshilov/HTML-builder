const { readdir, rm, access, writeFile, readFile, appendFile } = require('fs/promises');
const path = require('path');
const sourceDir = path.resolve(__dirname, 'styles');
const destinationDir = path.resolve(__dirname, 'project-dist', 'bundle.css');

const createFile = async (destination) => {
  try {
    await access(destination);
    await rm(destination);
    await writeFile(destination, '');
  } catch {
    await writeFile(destination, '');
  }
};

const createCssBundle = async (cssSourceDir, cssDestinationDir) => {
  const cssComponents = await readdir(cssSourceDir, { withFileTypes: true });
  for (const component of cssComponents) {
    if (component.isFile()) {
      const fileNameWExt = path.resolve(cssSourceDir, `${component.name}`);
      const fileExt = path.extname(fileNameWExt);
      if (fileExt === '.css') {
        const cssContent = await readFile(path.resolve(cssSourceDir, component.name), 'utf-8');
        await appendFile(cssDestinationDir, cssContent + '\n');
      }
    }
  }
};

const buildProject = async () => {
  await createFile(destinationDir);
  await createCssBundle(sourceDir, destinationDir);
};

buildProject();
