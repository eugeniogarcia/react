# Webpack

[Empezar con Webpack](https://webpack.js.org/guides/getting-started/)

Esta librería requiere de buildpack para instalarse. Podemos también instalar en webpack-dev server si lo que queremos es compilar y servir la aplicación (otra alternativa sería hacer `npx webpack` y luego `npx server`). Tenemos que instalar webpack: 

```ps
npm install webpack webpack-cli --save-dev
```

y el webpack-dev server:

```ps
npm install webpack-dev-server --save-dev
```

## Webpack.config.js

Creamos un `webpack.config`:

```json
const path = require("path");

// webpack.config.js
module.exports = {
  mode: "development",
  entry: path.join(__dirname, "main"),
  watch: false,
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
  resolve: {
    extensions: [".json", ".js", ".jsx"],
  },
  devServer: {
    contentBase: path.join(__dirname, "/contenido"),
    inline: true,
    host: "localhost",
    port: 5000,
    watchContentBase: true,
  },
};
```

### mode

Por defecto decimos que estamos en desarrollo:

```json
  mode: "development",
```

### entry

Podemos especificar varios puntos de entrada. En nuestro caso le decimos a webpack que empiece por main, que se encuentra en el raiz. Si por ejemplo, main estubiera en un directorio src, diríamos:

```json
  entry: path.join(__dirname,"src", "main"),
```

### watch

Indicamos que despues de compilar termine el script. Si hubieramos indicado `true`, cualquier cambio que hicieramos en los fuentes sería recompilado automáticamente:

```json
  watch: false,
```

### output

En este paso indicamos donde crear la salida del bundle. En nuestro caso en el directorio `dist`, y con un nombre `entrada.js`:

```json
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "entrada.js",
    chunkFilename: "[name].js",
  },
```

#### publicPath

__IMPORTANTE:__ lo que indicamos en `publicPath` determina como el codigo va a ser referenciado desde el contenido. Por ejemplo, con esta configuración:

```json
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/eugenio/",
    filename: "entrada.js",
    chunkFilename: "[name].js",
  },
```

La dirección publica del contenido será:

```html
<!DOCTYPE html>
<title>Prueba con workerize loader</title>
<script type="module" src="/eugenio/entrada.js"></script
```

La dirección `http://localhost:5000/eugenio/entrada.js` sera la dirección publica de nuestro script. La página `index.html` esta accesible en `http://localhost:5000/`.

### loaders

Indicamos que loaders - que interpretaran el código - usaremos. En nuestro caso el de workerize:

```json
module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: "workerize-loader" },
      },
    ],
  },
```

### devtool

Podemos trazar el bundle creado con el fuente original utilizando [source-map](https://webpack.js.org/configuration/devtool/):

```json
devtool: "source-map",
```

Esto nos permite que cuando haya un error, poder trazar el error a la línea de código del fuente. Hay varias [opciones](https://webpack.js.org/configuration/devtool/) para usar source maps.

Finalmente podemos configurar el devServer, si queremos usar con webpack el webpack-dev server - que tendremos que instalar por separado. En este caso hacemos que se monitorice el contenido, y que se escuche en el puerto 5000. El contenido, las páginas estáticas, las tenemos en el directorio `/contenido`. Cuando cambiemos el código, los cambios se volcaran a `/dist`, y la página en `/contenido` hacen referencia a `/dist` y se actualizan.

### devserver

```json
  devServer: {
    contentBase: path.join(__dirname, "/contenido"),
    inline: true,
    host: "localhost",
    port: 5000,
    watchContentBase: true,
  },
```

## Utilizar webpack

Hay varias opciones disponibles con webpack para compilar automáticamente el código:

- webpack's Watch Mode
- webpack-dev-server
- webpack-dev-middleware

En la mayoría de los casos nos servirá con webpack-dev-server, pero vamos a repasar las otras opciones.

### Watch

Añadimos en el package.json:

```json
        "obs": "webpack --watch",
        "wp": "webpack"
```

Si hacemos:

```ps
npm run wp
```

Se compilara el bundle pero una sola vez - salvo que en el webpack.config.js hayamos puesto `watch: false,`. Si queremos que se compile de forma continua haríamos:

```ps
npm run obs
```

Para poder servir la página podríamos hacer:

```ps
npx serve
```

### webpack-dev-server

Podemos lanzar el webpack-dev server así:

```ps
node_modules/.bin/webpack-dev-server
```

Pero __es más cómodo__ hacerlo así. Añadimos en el package.json el script:

```json
"scripts": {
  "srv": "webpack-dev-server --open"
}
```

y lo ejecutamos:

```ps
npm run srv
```

Esto abrira el nuestra aplicación con el servidor de aplicaciones. Si cambiamos alguno de los fuentes - la página html - el servidor lo refrescara automáticamente. Con la configuración que pusimos en el webpack.config.js, el servidor lo podemos encontrar en `http://localhost:5000/`. 

El webpack-dev server tiene muchas [opciones](https://webpack.js.org/configuration/dev-server/).

Si cambiamos cualquier cosa en el contenido estático, o en los fuentes, se actualizara la aplicación.

#### React Router

Para que react router funcione con el webpack-dev-server, tenemos que añadir `historyApiFallback: true`. Router utiliza la api de navegación de html5, con este parámetro la estamos habilitando en el webpack-dev-server:

```json
  devServer: {
    contentBase: path.join(__dirname, "/contenido"),
    inline: true,
    host: "localhost",
    port: 5000,
    watchContentBase: true,
    historyApiFallback: true ,
  }
```

### webpack-dev-middleware

webpack-dev-middleware is un wrapper que emite a un servidor, archivos que han sido procesados por webpack. Esta funcionalidad la utiliza internamente webpack-dev-server pero se ofrece tambien si queremos que el servidor sea otro, por ejemplo Express.

Instalamos Express y este middleware:

```ps
npm install --save-dev express webpack-dev-middleware
```

Añadimos la siguiente entrada en el package.json:

```json
"exp": "node server.js"
```

Y ahora:

```ps
npm start exp
```

Podemos encontrar nuestra aplicación en `http://localhost:3000/`.

En el servidor `server.js` tenemos la siguiente configuración. Primero importamos los modulos con webpack y el middleware:

```js
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
```

Configuramos webpack, y lo hacemos con la misma configuración que hemos usado en los otros casos de uso:

```js
const config = require("./webpack.config.js");
const compiler = webpack(config);
```

Especificamos el middleware. Como public path especificamos en la que hemos configurado también en con webpack para el bundle:

```js
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);
```

Si queremos buscar el fuente, el budnle, lo podemos encontrar en:

```ps
Si hacemos `http://localhost:3000/eugenio/entrada.js` podemos encontrar nuestro bundle!!.
```

Especificamos donde vamos a tener el contenido estático:

```js
app.use(express.static(config.devServer.contentBase));
```

Siguiento el ejemplo, como teníamos

```json
  devServer: {
    contentBase: path.join(__dirname, "/contenido"),
```

lo que estamos diciendo es que si hacemos `http://localhost:3000/index.html`, el conetendo se buscara en `./contenido/index.html`.

En resumen, con Express igual que con webpac-dev server, podemos distinguir dos tipos de localizaciones, donde guardamos los recursos estáticos (imagenes, páginas, estilos) y donde tendremos el código que renderiza dinámicamente el contenido. Los recursos estáticos toman preferencia sobre los dinámcos, el servidor trata de resolver primero el contenido estático, y sino puede, lo trata de resolver dinámicamente.

### Alternativa

Además de poder user webpack-dev server, o Express, podemos también usar `npx serve`. Los pasos serían, primero crear el bundle:

```ps
npx webpack
```

y luego servirlo:

```ps
npx serve
```

__npx serve__ no tiene que ver con webpack, es parte de __npm__.