const { readdir, copyFile, access, writeFile, readFile, appendFile, mkdir, rm } = require('fs/promises');
const path = require('path');
const cssSourceDir = path.resolve(__dirname, 'styles');
const htmlSourseDir = path.resolve(__dirname, 'components');
const assetsSourceDir = path.resolve(__dirname, 'assets');
const htmlTemplateDir = path.resolve(__dirname, 'template.html');
const destinationDir = path.resolve(__dirname, 'project-dist');
const htmlDestinationDir = path.resolve(destinationDir, 'index.html');
const cssDestinationDir = path.resolve(destinationDir, 'style.css');
const assetsDestinationDir = path.resolve(destinationDir, 'assets');

const copyDir = (sourceDir, destinationDir) => {
  readdir(sourceDir, { withFileTypes: true })
    .then(files => {
      files.forEach(file => {
        if (file.isDirectory()) {
          mkdir(path.resolve(destinationDir, file.name)).catch(err => console.log(err));
          copyDir(path.resolve(sourceDir, file.name), path.resolve(destinationDir, file.name));
        }
        if (file.isFile()) {
          copyFile(path.resolve(sourceDir, file.name), path.resolve(destinationDir, file.name)).catch(err => console.log(err));
        }
      });
    })
    .catch(err => console.log(err));
};

const createHtmlFromTemplate = async (htmlTemplateDir, htmlSourseDir, htmlDestinationDir) => {
  let template = await readFile(htmlTemplateDir, 'utf-8');
  const htmlComponents = await readdir(htmlSourseDir, { withFileTypes: true });
  for (const component of htmlComponents) {
    if (component.isFile()) {
      const fileNameWExt = path.resolve(htmlSourseDir, `${component.name}`);
      const fileExt = path.extname(fileNameWExt);
      if (fileExt === '.html') {
        const contents = await readFile(path.resolve(htmlSourseDir, component.name), 'utf8');
        template = template.replace(`{{${component.name.split('.')[0]}}}`, contents);
        await writeFile(htmlDestinationDir, template);
      }
    }
  }
};

const createCssBundle = async (cssSourceDir, cssDestinationDir) => {
  const cssComponents = await readdir(cssSourceDir, { withFileTypes: true });
  await writeFile(cssDestinationDir, '');
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

const createDir = async (destination) => {
  try {
    await access(destination);
    await rm(destination, { recursive: true });
    await mkdir(destination);
  } catch {
    await mkdir(destination);
  }
};

const buildProject = async () => {
  await createDir(destinationDir);
  await createHtmlFromTemplate(htmlTemplateDir, htmlSourseDir, htmlDestinationDir);
  await createCssBundle(cssSourceDir, cssDestinationDir);
  await createDir(assetsDestinationDir);
  copyDir(assetsSourceDir, assetsDestinationDir);
};

buildProject();
