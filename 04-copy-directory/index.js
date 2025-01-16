const path = require('node:path');
const fsPromises = require('node:fs/promises');

const sourcePath = path.resolve(__dirname, 'files');
const targetPath = path.resolve(__dirname, 'files-copy');
const files = fsPromises.readdir(sourcePath, { withFileTypes: true });

fsPromises.mkdir(targetPath, { recursive: true });

function clearTargetDir(targetFiles) {
  if (targetFiles) {
    targetFiles.then((files) => {
      files.forEach((file) => {
        fsPromises.rm(path.resolve(targetPath, file.name), {
          recursive: true,
          force: true,
        });
      });
    });
  }
}

function addFiles(files) {
  files
    .then((files) => {
      files.forEach((file) => {
        if (file.isFile()) {
          const src = path.resolve(sourcePath, file.name);
          const target = path.resolve(targetPath, file.name);
          fsPromises.copyFile(src, target);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

setTimeout(() => {
  const targetFiles = fsPromises.readdir(targetPath, { withFileTypes: true });
  clearTargetDir(targetFiles);
}, 100);

setTimeout(() => {
  addFiles(files);
}, 200);
