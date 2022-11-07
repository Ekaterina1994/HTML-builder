
const fs = require('fs');
const path = require('path');

const PATH_TO_FOLDER = path.join(__dirname, './files');
const PATH_TO_COPY = path.join(__dirname, './files-copy');

fs.mkdir(PATH_TO_COPY, { recursive: true }, () => {
  fs.readdir(PATH_TO_COPY, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        fs.unlink(path.join(__dirname, './files-copy/', file), err => {
          if (err) return console.error(err);
        });
      });
    }
  });
  
  fs.readdir(PATH_TO_FOLDER, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, './files', file.name), path.join(__dirname, './files-copy', file.name), (err) =>
          {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
});




