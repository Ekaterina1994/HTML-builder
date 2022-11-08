const fs = require('fs');
const path = require('path');

const PATH_TO_FOLDER = path.join(__dirname, './styles');
const BUNDLE = fs.createWriteStream(path.join(__dirname, './project-dist/bundle.css'));

fs.readdir(PATH_TO_FOLDER, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  }

  files.forEach((file) => {
    if (path.parse(file.name).ext === '.css') {
      fs.createReadStream(path.join(__dirname, './styles', file.name), 'utf8').addListener('data', data => {
        BUNDLE.write(data);
      });
    }
  });
});

