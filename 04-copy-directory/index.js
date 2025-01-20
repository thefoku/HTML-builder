const path = require('node:path');
const fsPromises = require('node:fs/promises');

const sourcePath = path.resolve(__dirname, 'files');
const targetPath = path.resolve(__dirname, 'files-copy');

async function clearTargetDir(targetFiles) {
  if (!targetFiles) {
    return;
  }

  for (const file of targetFiles) {
    await fsPromises.rm(path.resolve(targetPath, file.name), {
      recursive: true,
      force: true,
    });
  }
}

async function addFiles(files) {
  for (const file of files) {
    if (!file.isFile()) {
      return;
    }
    const src = path.resolve(sourcePath, file.name);
    const target = path.resolve(targetPath, file.name);

    await fsPromises.copyFile(src, target);
  }
}

async function main() {
  const files = await fsPromises.readdir(sourcePath, { withFileTypes: true });

  await fsPromises.mkdir(targetPath, { recursive: true });

  const targetFiles = await fsPromises.readdir(targetPath, {
    withFileTypes: true,
  });

  await clearTargetDir(targetFiles);
  await addFiles(files);
}

main();
