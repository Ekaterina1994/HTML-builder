const fs = require('fs');
const path = require('path');
const process = require('process');
// const readline = require('readline');

const PATH_TO_FILE = path.join(__dirname, 'text.txt');
const WELCOME_PHRASE = 'Please enter text\n';
const NEW_PHRASE = 'Enter a new text\n';
const BYE_PHRASE = 'Good luck!\n';

fs.open(PATH_TO_FILE, 'w', (err) => {
  if (err) throw err;
  process.stdin.on('data', data => {
    process.stdout.write(NEW_PHRASE);
    fs.appendFile(PATH_TO_FILE, data, (err) =>
    {
      if (err) {
        throw err;
      }
    });
  });
}
);

process.stdout.write(WELCOME_PHRASE);
process.stdin.on('data', analyzeUserInput);
process.on('exit', () => process.stdout.write(BYE_PHRASE));


function analyzeUserInput(rawArg) {
  const arg = rawArg.toString('utf8').slice(0, -1); 
  if (arg === 'exit') {
    process.exit(); 
  }
}






// let readLineValue = readline.createInterface({
//   input: process.stdin, // удобочитаемый поток
//   output: process.stdout, // возможность записи в поток
// });

// fs.WriteStream(PATH_TO_FILE);
// console.log('Введите текст');

// process.on('line', (line) => {
//   if (line.trim() === 'exit') {

//     console.log('Ввод завершен');
//     process.close();
//   } else {

//     fs.appendFile(PATH_TO_FILE, `${String(line)}\n`, function (error) {
//       if (error) throw error;
//     });

//     console.log('Продолжайте вводить текст');
//   }
// });
