const path = require("path");

// webpack.config.js
module.exports = {
  mode: "development",
  entry: path.join(__dirname, "main"),
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
        test: /\.worker\.js$/,
        use: { loader: "workerize-loader" },
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "/dist/"),
    inline: true,
    host: "localhost",
    port: 5000,
  },
  resolve: {
    extensions: [".json", ".js", ".jsx"],
  },
};
