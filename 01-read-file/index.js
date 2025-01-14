const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './text.txt'), 'utf8', (error, data) => {
  if (error) throw error;
  console.log(data);
});
