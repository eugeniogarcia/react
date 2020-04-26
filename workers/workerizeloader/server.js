const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
//Usamos la misma configuración de webpack
const config = require("./webpack.config.js");
//Instancia de webpack
const compiler = webpack(config);

//Usamos el middleware webpack-dev-middleware, con la misma configuración que hemos usado para webpack. El middleware utiliza la instanci de webpack, y la direccón publica donde webpack producirá los bundles
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

//Especifica donde poder encontrar el contenido estático (páginas, imagenes, ...)
app.use(express.static(config.devServer.contentBase));

app.listen(3000, function () {
  console.log("Escuchando en el puerto 3000!\n");
});

app.get("/hola", function (req, res) {
  res.send("Hola Mundo!");
});