const path = require('path');

const WorkerPlugin = require('worker-plugin');

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "index"),
  watch: true,
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "entrada.js",
    chunkFilename: "[name].js",
  },
  plugins: [
    new WorkerPlugin()
  ],
  resolve: {
    extensions: [".json", ".js", ".jsx"],
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "/dist/"),
    inline: true,
    host: "localhost",
    port: 5000,
  },
};