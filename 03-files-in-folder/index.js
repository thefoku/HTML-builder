const fs = require('fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const currentPath = path.resolve(__dirname, 'secret-folder');
const files = fsPromises.readdir(currentPath, { withFileTypes: true });

files
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        fs.stat(path.resolve(currentPath, file.name), (_, stats) => {
          const fileExt = path.extname(file.name).slice(1);
          const fileName = file.name.split('.')[0];
          const fileSize = stats.size / 1000;
          console.log(`${fileName} - ${fileExt} -  ${fileSize}kb`);
        });
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
