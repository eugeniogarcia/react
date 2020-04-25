const path = require('path');

module.exports = {
  //By default its value is ./src/index.js, but you can specify a different (or multiple entry points) by setting an entry property in the webpack configuration:
  entry: "./src/index.js",
  //The output property tells webpack where to emit the bundles it creates and how to name these files. It defaults to ./dist/main.js for the main output file and to the ./dist folder for any other generated file
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  //By setting the mode parameter to either development, production or none, you can enable webpack's built-in optimizations that correspond to each environment. The default value is production
  mode: "development",
};

