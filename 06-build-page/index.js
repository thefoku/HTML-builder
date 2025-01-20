const fs = require('fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const stylesDir = path.resolve(__dirname, 'styles');
const projectDist = path.resolve(__dirname, 'project-dist');
const componentsDir = path.resolve(__dirname, 'components');
const assetsDir = path.resolve(__dirname, 'assets');
const projectAssets = path.resolve(projectDist, 'assets');

async function buildPage() {
  // Create project-dist folder
  await fsPromises.mkdir(projectDist, { recursive: true });

  // Replace HTML-template
  await processTemplate();

  // Building CSS
  await bundleStyles();

  // Copying assets
  await resetAssets();
  await copyAssets();
}

// Replace HTML-template
async function processTemplate() {
  const templateFilePath = path.resolve(__dirname, 'template.html');
  const templateData = await fsPromises.readFile(templateFilePath, 'utf8');
  const components = await fsPromises.readdir(componentsDir, {
    withFileTypes: true,
  });

  let resultHTML = templateData;

  for (const file of components) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const componentName = path.basename(file.name, '.html');
      const componentContent = await fsPromises.readFile(
        path.resolve(componentsDir, file.name),
        'utf8',
      );
      resultHTML = resultHTML.replace(
        `{{${componentName}}}`,
        componentContent.slice(0, -1),
      );
    }
  }

  const outputPath = path.resolve(projectDist, 'index.html');
  await fsPromises.writeFile(outputPath, resultHTML);
}

// Bundle CSS
async function bundleStyles() {
  const styles = await fsPromises.readdir(stylesDir, { withFileTypes: true });
  const styleWrite = fs.createWriteStream(
    path.resolve(projectDist, 'style.css'),
  );

  for (const file of styles) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const fileContent = await fsPromises.readFile(
        path.resolve(stylesDir, file.name),
        'utf8',
      );
      styleWrite.write(fileContent);
    }
  }
}

async function resetAssets() {
  try {
    await fsPromises.access(projectAssets);

    await fsPromises.rm(projectAssets, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error removing old assets: ${err.message}`);
    }
  }
}

// Copying assets
async function copyAssets() {
  await fsPromises.mkdir(projectAssets, { recursive: true });
  const assets = await fsPromises.readdir(assetsDir, { withFileTypes: true });

  for (const asset of assets) {
    const src = path.resolve(assetsDir, asset.name);
    const dest = path.resolve(projectAssets, asset.name);

    if (asset.isDirectory()) {
      await copyDirectory(src, dest);
    } else {
      await fsPromises.copyFile(src, dest);
    }
  }
}

// Copying folder content
async function copyDirectory(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });
  const files = await fsPromises.readdir(src, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.resolve(src, file.name);
    const destPath = path.resolve(dest, file.name);

    if (file.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

// Build a page
buildPage();
