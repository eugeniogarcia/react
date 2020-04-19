# Instalación/Setup

Crea el esqueleto para una aplicación React:

```ps
npx create-react-app todos_ssr

cd todos_ssr

npm install express

mkdir server
```

Todo el código de Node.js necesita generarse con Babel, porque el server-side Node.js no entiende de JSX ni de modulos de ES. Babel se encarga de hacer la traducción. Para instalarlo:

```ps
npm install --save @babel/register @babel/preset-env @babel/preset-react ignore-styles
```

`ignore-styles` es una utilidad de Babel que hace que se ingnoren los archivos CSS cuando se emplea la sintaxis import.

# Actualizar index.js

Sustituimos __`ReactDOM.render`__ por __`ReactDOM.hydrate`__:

```js
ReactDOM.hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
  );
```

Esta vez vamos a pre-cargar el estado en el store. Tomamos el valor de `window.__PRELOADED_STATE__`.

```js
import { composeWithDevTools } from 'redux-devtools-extension';

const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__

const store = createStore(rootReducer, preloadedState,composeWithDevTools() );
```

# Crear server.js

Creamos un archivo llamado `server.js` en el directorio server que creamos con la instalación:

```js
const serverRenderer = (req, res, next) => {
    fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred");
      }

      const store = createStore(rootReducer);
      //const preloadedState = store.getState();
      const preloadedState = {
        "tareas": {
          "todos": [
            { id:0,
              tarea:"Esto es un ejemplo",
              completed:false},
            {
              id:1,
              tarea:"Esto es otro ejemplo",
              completed: true
            }],
          "total": 2 },
          "visibilidad": "SHOW_ALL"
        };

      const html = ReactDOMServer.renderToString(
        <Provider store={store}>
          <App />
        </Provider>);

      const estado=`<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}</script>`;

      const pagina=data.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>` + estado
      );

      return res.send(pagina);
    });
```

Estamos incluyendo en root `ReactDOMServer.renderToString(<Provider store={store}><App /></Provider>)`, de modo que se reenderiza en el lado de servidor nuestra App:

```js
data.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>` + estado
)
```

La página sería:

```js
      const html = ReactDOMServer.renderToString(
        <Provider store={store}>
          <App />
        </Provider>);
```

El estado lo incluimos en una propiedad de la página:

```js
const estado=`<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}</script>`;
```

Compilamos la aplicación. Esto creara un directorio build con nuestra pagina, la que hacermos referencia en el server.js: `./build/index.html`:

```ps
npm run build
```

Finalmente ejecutamos:

```ps
node server/index.js
```

Si nos conectamos a `http://localhost:8080/` veremos nuestra aplicación react, pero rederizada en el servidor

# ReactDOMServer

## renderToString()

Render a React element to its initial HTML. __React will return an HTML string__. You can use this method to __generate HTML on the server__ and send the markup down on the initial request for __faster page loads__ and to __allow search engines to crawl__ your pages for SEO purposes.

If you call __ReactDOM.hydrate() on a node that already has this server-rendered markup__, React will preserve it and __only attach event handlers__, allowing you to have a very performant first-load experience.

## renderToStaticMarkup()

Similar to renderToString, except __this doesn't create extra DOM attributes__ that React uses internally, such as data-reactroot. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

__If you plan to use React on the client to make the markup interactive__, do not use this method. Instead, __use renderToString__ on the server __and ReactDOM.hydrate()__ on the client.

## renderToNodeStream()

Render a React element to its initial HTML. Returns a Readable stream that outputs an HTML string. The HTML output by this stream is exactly equal to what ReactDOMServer.renderToString would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call ReactDOM.hydrate() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

## renderToStaticNodeStream()

Similar to renderToNodeStream, except this doesn't create extra DOM attributes that React uses internally, such as data-reactroot. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

The HTML output by this stream is exactly equal to what ReactDOMServer.renderToStaticMarkup would return.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use renderToNodeStream on the server and ReactDOM.hydrate() on the client.
