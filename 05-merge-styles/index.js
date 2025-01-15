const fs = require('fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const stylesDir = path.resolve(__dirname, 'styles');
const projectDist = path.resolve(__dirname, 'project-dist');
const styles = fsPromises.readdir(stylesDir, { withFileTypes: true });

const writer = fs.createWriteStream(path.resolve(projectDist, 'bundle.css'));

styles
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileToRead = path.resolve(stylesDir, file.name);
        fs.readFile(fileToRead, 'utf8', (error, data) => {
          if (error) throw error;
          writer.write(data);
        });
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
