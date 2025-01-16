const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath);

readStream.on('data', (data) => {
  console.log(data.toString());
  readStream.close();
});
