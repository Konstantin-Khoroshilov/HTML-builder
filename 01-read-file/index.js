const fs = require('fs');
const path = require('path');
const { stdout } = process;
const input = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

input.on('data', (data) => stdout.write(data.toString()));
input.on('error', (error) => stdout.write(`Error: ${error.message}`));
