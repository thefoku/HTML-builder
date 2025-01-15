// const fs = require('fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const sourcePath = path.resolve(__dirname, 'files');
const targetPath = path.resolve(__dirname, 'files-copy');
const files = fsPromises.readdir(sourcePath, { withFileTypes: true });

// console.log(targetPath);

fsPromises.mkdir(targetPath, { recursive: true });

files
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const src = path.resolve(sourcePath, file.name);
        const target = path.resolve(targetPath, file.name);
        console.log(src);
        fsPromises.copyFile(src, target);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
