const { readdir, writeFile, readFile } = require('fs/promises');
const path = require('path');
const sourceDir = path.resolve(__dirname, 'styles');
const destinationDir = path.resolve(__dirname, 'project-dist', 'bundle.css');

const createCssBundle = async (cssSourceDir, cssDestinationDir) => {
  const cssComponents = await readdir(cssSourceDir, { withFileTypes: true });
  let cssContent = '';
  for (const component of cssComponents) {
    if (component.isFile()) {
      const fileInfo = path.parse(path.resolve(cssSourceDir, component.name));
      if (fileInfo.ext === '.css') {
        const newCssContent = await readFile(path.resolve(cssSourceDir, component.name), 'utf-8');
        cssContent += newCssContent + '\n';
      }
    }
  }
  await writeFile(cssDestinationDir, cssContent);
};

createCssBundle(sourceDir, destinationDir);
