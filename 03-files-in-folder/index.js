const fs = require('fs');
const path = require('path');


const PATH_TO_FILE = path.join(__dirname, './secret-folder');


fs.readdir(PATH_TO_FILE, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error);
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        fs.stat(`${PATH_TO_FILE}/${file.name}`, (err, stats) => {
          if (err) {
            console.log(err);
          }
          console.log(`${path.parse(file.name).name} - ${path.parse(file.name).ext} - ${stats.size}bytes`);
        });
      }
    });
  }
});



