// All imports
const fs = require('fs');
const path = require('path');

const writer = fs.createWriteStream(path.resolve(__dirname, './text.txt'));

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

// Start
console.log('Hey! Write anything you want to the file:');

rl.question('', (answer) => {
  rl.on('line', (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      console.log('Have a nice day!');
    } else {
      console.log(`You wrote: ${input}`);
      writer.write(input + '\n');
    }
  });
  rl.on('SIGINT', function () {
    rl.close();
    console.log('Have a nice day!');
  });
  console.log(`You wrote: ${answer}`);
  writer.write(answer + '\n');
});
