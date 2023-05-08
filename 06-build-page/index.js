const { readdir, copyFile, access, writeFile, readFile, appendFile, mkdir, rm } = require('fs/promises');
const path = require('path');
const cssSourceDir = path.resolve(__dirname, 'styles');
const assetsSourceDir = path.resolve(__dirname, 'assets');
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
const build = async () => {
  //заполнение html файла
  let template = await readFile(path.resolve(__dirname, 'template.html'), 'utf-8');
  const htmlComponents = await readdir(path.resolve(__dirname, 'components'), { withFileTypes: true });
  for (const component of htmlComponents) {
    const contents = await readFile(path.resolve(__dirname, 'components', component.name), 'utf8');
    template = template.replace(`{{${component.name.split('.')[0]}}}`, contents);
    await writeFile(htmlDestinationDir, template);
  }
  //заполнение css файла
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
  //копирование папки assets
  try {
    //если папка уже есть, удалить её, создать заново и скопировать в неё содержимое assets
    await access(assetsDestinationDir);
    await rm(assetsDestinationDir, { recursive: true });
    await mkdir(assetsDestinationDir);
    copyDir(assetsSourceDir, assetsDestinationDir);
  } catch {
    //папки нет: создать её и скопировать содержимое assets
    await mkdir(assetsDestinationDir);
    copyDir(assetsSourceDir, assetsDestinationDir);
  }
}
const createDist = async () => {
  //сборка проекта
  try {
    //если папка со сборкой существует - удаляем её, создаём заново, а затем собираем проект
    await access(destinationDir);
    await rm(destinationDir, { recursive: true });
    await mkdir(destinationDir);
    build();
  } catch {
    //папки со сборкой проекта нет: создаём папку, потом собираем проект
    await mkdir(destinationDir);
    build();
  }
}

createDist();
