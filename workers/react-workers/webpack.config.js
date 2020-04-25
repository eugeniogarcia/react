const path = require('path');
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
  module: {
    rules: [
      {
        test: /\.worker\.js?$/,
        use: { loader: "worker-loader" },
      },
      {
        loader: "babel-loader",
        test: /\.worker\.js?$/,
        exclude: /node_modules/,
      },
    ],
  },
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