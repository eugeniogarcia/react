# Worker-Loader

Para utilizar webpack y React tenemos que configurar una serie de plugins - html, css, y styles -. Vamos a ver en este proyecto como hacerlo. Una vez hecho esto, confguraremos web workers y utilizaremos hooks de react.

## Instalación/Setup

### Esqueleto de Aplicacion React

Crea el esqueleto para una aplicación React:

```js
npx create-react-app workers

cd workers
```

### Webpack


Instalamos [webpack](../workerizeloader/Webpack.md):

```ps
npm install webpack webpack-cli --save-dev
```

y el webpack-dev server:

```ps
npm install webpack-dev-server --save-dev
```

Creamos los scripts en el `package.json` para poder lanzar la compilacion con webpack, y abrir el servidor webpack-dev

"scripts": {
  "srv": "webpack-dev-server --open",
  "wp": "webpack --mode production"
}

Con estas entradas, para crear el bundle de webpack haríamos:

```ps
npm run wp
```

Si queremos hacer el bundle y abrir el webpack-dev server:

```ps
npm run srv
```

### Babel

Para hacer el transpiling del javascript de React para adecuarlo a navegadores antiguos:

```ps
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
```

Creamos un archivo llamado `.babelrc` en el raiz del proyecto con el siguiente contenido:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

En el webpack.config.js configuramos el loader de babel:

```json
 module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
```

### React

#### Plugin para html

Para mostrar la aplicación React tenemos que crear una página html con webpack, de modo que el bundle resultante se incluya dentro de un tag `<script>`.

Para ello necesitamos otras dos librerías para que webpack procese un html:

```ps
npm i html-webpack-plugin html-loader --save-dev
```

Actualizamos el webpack.config.js. Primero añadimos el plugin:

```json
//Plugin para generar el html
const HtmlWebPackPlugin = require("html-webpack-plugin");
```

actualizamos la lista de __módulos__ y el __plugin__:

```json
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
          loader: "html-loader"
        }
      ]
    },
  ],
},
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    })
  ],
```

Con este plugin lo que estamos haciendo es buscar en `./src/index.html` una página web, y convertirla con webpack, de modo que apuntara al bundle creado. Esta hoja se deposita en el mismo lugar donde se deposita todo el código, que en nuestro caso es:

```json
module.exports = {
  entry: path.join(__dirname, "src", "index"),
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/eugenio/",
    filename: "entrada.js",
```

Esto es, estamos dejando en el directorio dist el bundle. El directorio publico donde toda esta información estara accesible es /eugenio. Esto significa que en `http://localhost:5000/eugenio/entrada.js` y `http://localhost:5000/eugenio/index.html` encontraremos los dos recursos que hemos generado.

Por otro lado si vemos la configuración del webpacl-dev server:

```json
  devServer: {
    contentBase: path.join(__dirname, "/public/"),
```

Efectivamente el contenido estático se servirá desde `/public`. Con todo esto al hacer

```ps
npm start srv
```

en `http://localhost:5000/eugenio/index.html` tendremos nuestra aplicación. 

#### Plugin para tratar modulos css

Actualizamos el webpack.config.js:

```json
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
          loader: "html-loader"
        }
      ]
    },
    {
      test: /\.css$/,
      loader: 'style-loader'
    }, {
      test: /\.css$/,
      loader: 'css-loader',
      query: {
        modules: true
      }
    }
  ],
},
```

El loader de estilos, style-loader, no precisa ninguna configuracion. El css-loader se tiene que configurar. Aquí estamo habilitando el modo `CSS modules mode`.

### react-hooks-worker

Para poder usar la librería `react-hooks-worker`, necesitamos instalar el siguiente [plugin](https://github.com/GoogleChromeLabs/worker-plugin):

```ps
npm install -D worker-plugin
```

y ajustar el webpack.config.js

```json
const WorkerPlugin = require("worker-plugin");

module.exports = {
 plugins: [
    new WorkerPlugin(),
    ...
  ],
```

De esta forma, cuando hagamos referencia al javascript que contiene un worker - por ejemplo, aqui estamos haciendo referencia al javascript `./slow_fib.worker.js` -, este se incluirá en entre los assets que empaquete webpack:

```js
const createWorker = () => new Worker('./slow_fib.worker.js', { type: 'module' });
```

## Worker

### worker thread

En un modulo creamos nuestro código, y exponemos la función que nos interese ejecutar en un thread separado - en este ejemplo fib:

```js
import { exposeWorker } from 'react-hooks-worker';

const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

exposeWorker(fib);
```

### Componente React

Para usar el worker, primero creamos una instancia:

```js
import React from 'react';
import { useWorker } from 'react-hooks-worker';

const createWorker = () => new Worker('./slow_fib.worker.js', { type: 'module' });
```

Y cuando nos interese referencia la función del worker, tan solo haremos `useWorker`:

```js
const CalcFib = ({ count }) => {
    const { result, error } = useWorker(createWorker, count);
    if (error) return <div>Error: {error}</div>;
    return <div>Result: {result}</div>;
};
```