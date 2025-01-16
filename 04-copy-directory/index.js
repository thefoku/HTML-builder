const path = require('node:path');
const fsPromises = require('node:fs/promises');

const sourcePath = path.resolve(__dirname, 'files');
const targetPath = path.resolve(__dirname, 'files-copy');
const files = fsPromises.readdir(sourcePath, { withFileTypes: true });
const targetFiles = fsPromises.readdir(targetPath, { withFileTypes: true });

fsPromises.mkdir(targetPath, { recursive: true });

function clearTargetDir(targetFiles) {
  targetFiles.then((files) => {
    if (files.length > 0) {
      files.forEach((file) => {
        const target = path.resolve(targetPath, file.name);
        fsPromises.unlink(target);
      });
    }
  });
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

clearTargetDir(targetFiles);
setTimeout(() => {
  addFiles(files);
}, 1000);
