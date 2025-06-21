const path = require('path');

module.exports = {
  mode: 'development',
  entry: './client.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
