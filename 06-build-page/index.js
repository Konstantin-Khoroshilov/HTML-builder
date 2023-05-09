const { readdir, copyFile, access, writeFile, readFile, mkdir, rm } = require('fs/promises');
const path = require('path');
const cssSourceDir = path.resolve(__dirname, 'styles');
const htmlSourseDir = path.resolve(__dirname, 'components');
const assetsSourceDir = path.resolve(__dirname, 'assets');
const htmlTemplateDir = path.resolve(__dirname, 'template.html');
const destinationDir = path.resolve(__dirname, 'project-dist');
const htmlDestinationDir = path.resolve(destinationDir, 'index.html');
const cssDestinationDir = path.resolve(destinationDir, 'style.css');
const assetsDestinationDir = path.resolve(destinationDir, 'assets');

const createDir = async (destination) => {
  try {
    await access(destination);
    await rm(destination, { recursive: true });
    await mkdir(destination);
  } catch {
    await mkdir(destination);
  }
};

const copyDir = async (sourceDir, destinationDir) => {
  await createDir(destinationDir);
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

const createHtmlFromTemplate = async (htmlTemplateDir, htmlSourseDir, htmlDestinationDir) => {
  let template = await readFile(htmlTemplateDir, 'utf-8');
  const htmlComponents = await readdir(htmlSourseDir, { withFileTypes: true });
  for (const component of htmlComponents) {
    if (component.isFile()) {
      const fileInfo = path.parse(path.resolve(htmlSourseDir, component.name));
      if (fileInfo.ext === '.html') {
        const newHtmlContent = await readFile(path.resolve(htmlSourseDir, component.name), 'utf8');
        template = template.replace(`{{${fileInfo.name}}}`, newHtmlContent);
      }
    }
  }
  await writeFile(htmlDestinationDir, template);
};

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

const buildProject = async () => {
  await createDir(destinationDir);
  await createHtmlFromTemplate(htmlTemplateDir, htmlSourseDir, htmlDestinationDir);
  await createCssBundle(cssSourceDir, cssDestinationDir);
  await createDir(assetsDestinationDir);
  copyDir(assetsSourceDir, assetsDestinationDir);
};

buildProject();
