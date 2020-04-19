import path from 'path'
import fs from 'fs'

import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createStore } from 'redux'
import rootReducer from '../src/reducers'
import { Provider } from 'react-redux'

import App from '../src/components/App'

const PORT = 8080
const app = express()

const router = express.Router()

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
}
router.use('^/$', serverRenderer)

router.use(
    express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' })
)

// tell the app to use the above rules
app.use(router)

// app.use(express.static('./build'))
app.listen(PORT, () => {
    console.log(`SSR running on port ${PORT}`)
})