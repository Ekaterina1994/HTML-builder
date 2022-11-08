const fs = require('fs');
const path = require('path');

const PATH_TO_PROJECT_DIST = path.join(__dirname, './project-dist');
const PATH_TO_ROOT_FOLDER = path.join(__dirname);
const PATH_TO_COMPONENTS = path.join(__dirname, './components');
const PATH_TO_STYLES_FOLDER = path.join(__dirname, './styles');
const PATH_TO_ASSETS = path.join(__dirname, './assets');
const PATH_TO_DEST_ASSETS = path.join(__dirname, './project-dist', './assets');

async function createFolder(path) {
  fs.promises.mkdir(path, { recursive: true }, (error) => {
    try {
      if (error) throw error;
    }
    catch (error) {
      console.log(error);
    }
  });
}

async function deleteFiles(path) {
  const arr = await fs.promises.readdir(path, { encoding: 'utf-8', withFileTypes: true });
  if (arr.length !== 0) {
    arr.forEach((file) => {
      if (file.isFile()) {
        fs.promises.unlink(`${path}/${file.name}`, error => {
          try {
            if (error) throw error;
          }
          catch (error) {
            console.log(error);
          }
        });
      } else {
        deleteFiles(path + '/' + file.name);
      }
    });
  }
}

const readFileAsync = async (path) => {
  return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      return reject(err.message);
    }
    resolve(data);
  }));
};

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => fs.promises.writeFile(path, data, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

const openFileForWriting = (file) => {
  fs.open(file, 'w', (error) => {
    if (error) throw error;
  });
};

const copyFiles = async (files, name) => {
  if (Array.isArray(files)) {
    files.forEach((file) => fs.promises.copyFile(`${PATH_TO_ASSETS}/${name}/${file.name}`, `${PATH_TO_DEST_ASSETS}/${name}/${file.name}`, 0, (error) => {
      try {
        if (error) throw error;
      }
      catch (error) {
        console.log(error);
      }
    }));
  } else {
    fs.promises.copyFile(`${PATH_TO_ASSETS}/${files}`, `${PATH_TO_DEST_ASSETS}/${files}`, 0, (error) => {
      try {
        if (error) throw error;
      }
      catch (error) {
        console.log(error);
      }
    });
  }
};

(async function bundleWeb() {
  await createFolder(PATH_TO_PROJECT_DIST);
  await deleteFiles(PATH_TO_PROJECT_DIST);
  const bundleHTML = path.join(__dirname, './project-dist', 'index.html');
  const bundleCSS = path.join(__dirname, './project-dist', 'style.css');
  await createFolder(PATH_TO_DEST_ASSETS);

  const files = await fs.promises.readdir(PATH_TO_ROOT_FOLDER, { encoding: 'utf-8', withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      openFileForWriting(bundleHTML);
      const templateStream = fs.createReadStream(path.join(__dirname, file.name), 'utf-8');
      let data = '';
      templateStream.on('data', chunk => data += chunk);
      templateStream.on('end', () => {
        const arrRegEx = data.match(/\{{([^}]+)\}}/g);
        for (const item of arrRegEx) {
          readFileAsync(`${PATH_TO_COMPONENTS}/${item.slice(2, -2)}.html`)
            .then((result) => data = data.replace(item, result))
            .then((data) => writeFileAsync(bundleHTML, data))
            .catch(error => console.log(error));
        }
      });
    } else if (file.isDirectory() && file.name === 'styles') {
      const filesCSS = await fs.promises.readdir(PATH_TO_STYLES_FOLDER, { encoding: 'utf-8', withFileTypes: true });
      openFileForWriting(bundleCSS);
      const resultCSSArr = [];
      for (const fileCSS of filesCSS) {
        if (fileCSS.isFile() && path.extname(fileCSS.name) === '.css') {
          readFileAsync(`${PATH_TO_STYLES_FOLDER}/${fileCSS.name}`)
            .then(data => { resultCSSArr.push(data); })
            .then(() => writeFileAsync(bundleCSS, resultCSSArr.join('\n')))
            .catch((err) => console.log(err));
        }
      }
    } else if (file.isDirectory() && file.name === 'assets') {
      const filesAssets = await fs.promises.readdir(PATH_TO_ASSETS, { encoding: 'utf-8', withFileTypes: true });
      for (let asset of filesAssets) {
        if (asset.isDirectory()) {
          await createFolder(path.join(__dirname, './project-dist', './assets', asset.name));
          const files = await fs.promises.readdir(path.join(__dirname, './assets', asset.name), { encoding: 'utf-8', withFileTypes: true });
          copyFiles(files, asset.name);
        } else {
          copyFiles(asset.name);
        }
      }
    }
  }
})();