const path = require("path");

// webpack.config.js
module.exports = {
  mode: "development",
  entry: path.join(__dirname, "main"),
  watch: false,
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/eugenio",
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
  resolve: {
    extensions: [".json", ".js", ".jsx",".html"],
  },
  devServer: {
    contentBase: path.join(__dirname, "/contenido"),
    inline: true,
    host: "localhost",
    port: 5000,
    watchContentBase: true,
    compress: true,
  },
};
