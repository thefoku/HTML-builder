const fs = require('fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const stylesDir = path.resolve(__dirname, 'styles');
const projectDist = path.resolve(__dirname, 'project-dist');
const componentsDir = path.resolve(__dirname, 'components');

const components = fsPromises.readdir(componentsDir, { withFileTypes: true });
const styles = fsPromises.readdir(stylesDir, { withFileTypes: true });

fsPromises.mkdir(projectDist, { recursive: true });

const styleWrite = fs.createWriteStream(path.resolve(projectDist, 'style.css'));

const templateFilePath = path.resolve(__dirname, 'template.html');
const templateWriter = fs.createWriteStream(
  path.resolve(projectDist, 'index.html'),
);

const arr = [];

fs.readFile(templateFilePath, 'utf8', (error, templateData) => {
  if (error) throw error;
  let templateFileData = templateData;

  components.then((comps) => {
    comps.forEach((file) => {
      fs.readFile(
        path.resolve(componentsDir, file.name),
        'utf8',
        (error, compData) => {
          if (error) throw error;
          const fileName = path.basename(file.name).split('.')[0];
          templateFileData = templateFileData.replace(
            `{{${fileName}}}`,
            compData.slice(0, -1),
          );
          arr.push(templateFileData);
          if (arr[comps.length - 1])
            templateWriter.write(arr[comps.length - 1]);
        },
      );
    });
  });
});

// bundle all styles
styles
  .then((dirs) => {
    dirs.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileToRead = path.resolve(stylesDir, file.name);
        fs.readFile(fileToRead, 'utf8', (error, data) => {
          if (error) throw error;
          styleWrite.write(data);
        });
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Move assets to project-dist
const assetsDir = path.resolve(__dirname, 'assets');
const assets = fsPromises.readdir(assetsDir, { withFileTypes: true });

const projectAssets = path.resolve(projectDist, 'assets');
fsPromises.mkdir(projectAssets, { recursive: true });

function copyAssets(assets) {
  assets
    .then((dirs) => {
      dirs.forEach((dir) => {
        const assetDirectoryFiles = fsPromises.readdir(
          path.resolve(assetsDir, dir.name),
          {
            withFileTypes: true,
          },
        );

        // create folders
        fsPromises.mkdir(path.resolve(projectAssets, dir.name), {
          recursive: true,
        });

        assetDirectoryFiles.then((files) => {
          files.forEach((file) => {
            const src = path.resolve(assetsDir, dir.name, file.name);
            const target = path.resolve(projectAssets, dir.name, file.name);
            fsPromises.copyFile(src, target);
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
setTimeout(() => {
  copyAssets(assets);
}, 300);

setTimeout(() => {
  const projectAssetsDirs = fsPromises.readdir(projectAssets, {
    withFileTypes: true,
  });
  deleteOldAssets(projectAssetsDirs);
}, 100);

function deleteOldAssets(assets) {
  assets
    .then((dirs) => {
      dirs.forEach((dir) => {
        if (dirs.length > 0) {
          fsPromises.rm(path.resolve(projectAssets, dir.name), {
            recursive: true,
            force: true,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
