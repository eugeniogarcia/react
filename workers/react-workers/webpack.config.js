const path = require('path');

//Plugin para generar el html
const HtmlWebPackPlugin = require("html-webpack-plugin");

//Para usar react-hooks-worker
const WorkerPlugin = require("worker-plugin");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "index"),
  watch: false,
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/eugenio/",
    filename: "entrada.js",
    chunkFilename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        loader: "style-loader",
      },
      {
        test: /\.css$/,
        loader: "css-loader",
        query: {
          modules: true,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new WorkerPlugin()
  ],
  resolve: {
    extensions: [".json", ".js", ".jsx"],
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "/public/"),
    inline: true,
    host: "localhost",
    port: 5000,
    watchContentBase: true,
    compress: false,
  },
};